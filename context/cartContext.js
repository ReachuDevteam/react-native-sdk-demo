import React, {createContext, useReducer, useContext} from 'react';
import {SELECT_COUNTRY, SELECT_CURRENCY} from '../consts/env';

const initialState = {
  selectedCurrency: SELECT_CURRENCY,
  selectedCountry: SELECT_COUNTRY,
  cartId: '',
  cartItems: [],
  checkout: {},
  selectedScreen: 'Products',
};

export const actions = {
  SET_SELECTED_CURRENCY: 'SET_SELECTED_CURRENCY',
  SET_SELECTED_COUNTRY: 'SET_SELECTED_COUNTRY',
  SET_CART_ID: 'SET_CART_ID',
  SET_SELECTED_SCREEN: 'SET_SELECTED_SCREEN',
  ADD_CART_ITEM: 'ADD_CART_ITEM',
  REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
  UPDATE_CART_ITEM_QUANTITY: 'UPDATE_CART_ITEM_QUANTITY',
  SET_CHECKOUT_STATE: 'SET_CHECKOUT_STATE',
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_SELECTED_CURRENCY:
      return {...state, selectedCurrency: action.payload};
    case actions.SET_SELECTED_COUNTRY:
      return {...state, selectedCountry: action.payload};
    case actions.SET_CART_ID:
      return {...state, cartId: action.payload};
    case actions.SET_SELECTED_SCREEN:
      return {...state, selectedScreen: action.payload};
    case actions.ADD_CART_ITEM:
      return {...state, cartItems: [...state.cartItems, action.payload]};
    case actions.REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          item => item.cartItemId !== action.payload,
        ),
      };
    case actions.UPDATE_CART_ITEM_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.cartItemId === action.payload.cartItemId
            ? {...item, quantity: action.payload.quantity}
            : item,
        ),
      };
    case actions.SET_CHECKOUT_STATE:
      return {...state, checkout: action.payload};
    default:
      return state;
  }
};

const CartContext = createContext();

export const CartProvider = ({children}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{state, dispatch}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
