import {useMutation} from '@apollo/client';
import {
  CREATE_ITEM_TO_CART,
  REMOVE_ITEM_FROM_CART,
  UPDATE_ITEM_TO_CART,
} from '../mutations/cartItem';
import {useCallback} from 'react';

export const useCreateItemToCart = () => {
  const [mutate, {data, loading, error}] = useMutation(CREATE_ITEM_TO_CART);

  const createItemToCart = useCallback(
    async (cartId, lineItems) => {
      try {
        const response = await mutate({
          variables: {cartId, lineItems},
        });
        console.log('Cart item created successfully', response.data);
        return response.data.Cart.AddItem;
      } catch (e) {
        console.error('Error create cart item', e);
        throw e;
      }
    },
    [mutate],
  );

  return {createItemToCart, data, loading, error};
};

export const useUpdateItemToCart = () => {
  const [mutate, {data, loading, error}] = useMutation(UPDATE_ITEM_TO_CART);

  const updateItemToCart = useCallback(
    async (cartId, cartItemId, qty, shippingId) => {
      try {
        const response = await mutate({
          variables: {cartId, cartItemId, qty, shippingId},
        });
        console.log('Cart item updated successfully', response.data);
        return response.data.Cart.UpdateItem;
      } catch (e) {
        console.error('Error updating cart item', e);
        throw e;
      }
    },
    [mutate],
  );

  return {updateItemToCart, data, loading, error};
};

export const useRemoveItemFromCart = () => {
  const [mutate, {data, loading, error}] = useMutation(REMOVE_ITEM_FROM_CART);

  const removeItemFromCart = useCallback(
    async (cartId, cartItemId) => {
      try {
        const response = await mutate({
          variables: {cartId, cartItemId},
        });
        console.log('Cart item removed successfully', response.data);
        return response.data.Cart.DeleteItem;
      } catch (e) {
        console.error('Error removed cart item', e);
        throw e;
      }
    },
    [mutate],
  );

  return {removeItemFromCart, data, loading, error};
};
