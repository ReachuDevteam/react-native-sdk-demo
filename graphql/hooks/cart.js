import {useCallback, useState} from 'react';
import {useReachuSdk} from '../../context/reachu-sdk-provider';

export const useCreateCart = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeCreateCart = useCallback(
    async (customerSessionId, currency, country) => {
      setLoading(true);
      setError(null);
      try {
        const cart = await sdk.cart.create({
          customer_session_id: customerSessionId,
          currency,
          shippingCountry: country,
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

  return {executeCreateCart, data, loading, error};
};

export const useUpdateCart = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeUpdateCart = useCallback(
    async (cartId, shippingCountry) => {
      setLoading(true);
      setError(null);
      try {
        const cart = await sdk.cart.update({
          cart_id: cartId,
          shipping_country: shippingCountry,
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

  return {executeUpdateCart, data, loading, error};
};
