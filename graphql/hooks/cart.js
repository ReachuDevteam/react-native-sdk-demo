import {useMutation} from '@apollo/client';
import {CREATE_CART_MUTATION, UPDATE_CART_MUTATION} from '../mutations/cart';
import {useCallback} from 'react';

export const useCreateCart = () => {
  const [mutate, {data, loading, error}] = useMutation(CREATE_CART_MUTATION);

  const executeCreateCart = useCallback(
    async (customerSessionId, currency) => {
      try {
        const response = await mutate({
          variables: {customerSessionId, currency},
        });
        console.log('Cart created successfully', response.data);
        return response.data.Cart.CreateCart;
      } catch (e) {
        console.error('Error creating cart', JSON.stringify(e));
        throw e;
      }
    },
    [mutate],
  );

  return {executeCreateCart, data, loading, error};
};

export const useUpdateCart = () => {
  const [mutate, {data, loading, error}] = useMutation(UPDATE_CART_MUTATION);

  const executeUpdateCart = useCallback(
    async (cartId, shippingCountry) => {
      try {
        const response = await mutate({
          variables: {cartId, shippingCountry},
        });
        console.log('Cart updated successfully', response.data);
        return response.data.Cart.UpdateCart;
      } catch (e) {
        console.error('Error updating cart', e);
        throw e;
      }
    },
    [mutate],
  );

  return {executeUpdateCart, data, loading, error};
};
