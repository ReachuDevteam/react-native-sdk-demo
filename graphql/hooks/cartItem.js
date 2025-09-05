import {useCallback, useState} from 'react';
import {useReachuSdk} from '../../context/reachu-sdk-provider';

export const useCreateItemToCart = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createItemToCart = useCallback(
    async (cartId, lineItems) => {
      setLoading(true);
      setError(null);
      try {
        const cart = await sdk.cart.addItem({
          cart_id: cartId,
          line_items: lineItems,
        });
        setData(cart);
        return cart;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {createItemToCart, data, loading, error};
};

export const useUpdateItemToCart = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateItemToCart = useCallback(
    async (cartId, cartItemId, qty, shippingId) => {
      setLoading(true);
      setError(null);
      try {
        const cart = await sdk.cart.updateItem({
          cart_id: cartId,
          cart_item_id: cartItemId,
          quantity: qty,
          ...(shippingId ? {shipping_id: shippingId} : {}),
        });
        setData(cart);
        return cart;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {updateItemToCart, data, loading, error};
};

export const useRemoveItemFromCart = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeItemFromCart = useCallback(
    async (cartId, cartItemId) => {
      setLoading(true);
      setError(null);
      try {
        const cart = await sdk.cart.deleteItem({
          cart_id: cartId,
          cart_item_id: cartItemId,
        });
        setData(cart);
        return cart;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {removeItemFromCart, data, loading, error};
};
