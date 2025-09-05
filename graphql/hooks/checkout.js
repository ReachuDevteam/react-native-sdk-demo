// graphql/hooks/checkout.js
import {useCallback, useState} from 'react';
import {useReachuSdk} from '../../context/reachu-sdk-provider';

export const useCreateCheckout = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCheckout = useCallback(
    async cartId => {
      setLoading(true);
      setError(null);
      try {
        const checkout = await sdk.checkout.create({cart_id: cartId});
        setData(checkout);
        return checkout;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {createCheckout, data, loading, error};
};

export const useUpdateCheckout = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCheckout = useCallback(
    async (
      checkoutId,
      email,
      billingAddress,
      shippingAddress,
      buyerAcceptsTermsConditions = true,
      buyerAcceptsPurchaseConditions = true,
    ) => {
      setLoading(true);
      setError(null);
      try {
        const _data = {
          checkout_id: checkoutId,
          billing_address: {
            ...(billingAddress || {}),
            email: (billingAddress && billingAddress.email) || email,
          },
          shipping_address: {
            ...(shippingAddress || {}),
            email: (shippingAddress && shippingAddress.email) || email,
          },
          buyer_accepts_terms_conditions: buyerAcceptsTermsConditions,
          buyer_accepts_purchase_conditions: buyerAcceptsPurchaseConditions,
        };

        const checkout = await sdk.checkout.update(_data);
        setData(checkout);
        return checkout;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {updateCheckout, data, loading, error};
};

export const useCheckoutInitPaymentKlarna = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkoutInitPaymentKlarna = useCallback(
    async (checkoutId, countryCode, href, email) => {
      setLoading(true);
      setError(null);
      try {
        const res = await sdk.payment.klarnaInit({
          checkout_id: checkoutId,
          country_code: countryCode,
          href,
          email,
        });
        setData(res);
        return res;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {checkoutInitPaymentKlarna, data, loading, error};
};

export const useCheckoutInitPaymentStripe = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkoutInitPaymentStripe = useCallback(
    async (email, paymentMethod, successUrl, checkoutId) => {
      setLoading(true);
      setError(null);
      try {
        const res = await sdk.payment.stripeLink({
          checkout_id: checkoutId,
          success_url: successUrl,
          email,
          payment_method: paymentMethod,
        });
        setData(res);
        return res;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {checkoutInitPaymentStripe, data, loading, error};
};

export const useCheckoutPaymentIntentStripe = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkoutPaymentIntentStripe = useCallback(
    async (checkoutId, returnEphemeralKey) => {
      setLoading(true);
      setError(null);
      try {
        const res = await sdk.payment.stripeIntent({
          checkout_id: checkoutId,
          return_ephemeral_key: !!returnEphemeralKey,
        });
        setData(res);
        return res;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {checkoutPaymentIntentStripe, data, loading, error};
};
