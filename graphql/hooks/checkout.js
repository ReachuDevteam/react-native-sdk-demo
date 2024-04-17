import {useMutation} from '@apollo/client';
import {
  CHECKOUT_INIT_PAYMENT_KLARNA,
  CHECKOUT_INIT_PAYMENT_STRIPE,
  CHECKOUT_PAYMENT_INTENT_STRIPE,
  CREATE_CHECKOUT,
  UPDATE_CHECKOUT,
} from '../mutations/checkout';
import {useCallback} from 'react';

export const useCreateCheckout = () => {
  const [mutate, {data, loading, error}] = useMutation(CREATE_CHECKOUT);

  const createCheckout = useCallback(
    async cartId => {
      try {
        const response = await mutate({variables: {cartId}});
        console.log('Checkout created successfully', response.data);
        return response.data.Checkout.CreateCheckout;
      } catch (e) {
        console.error('Error created checkout', e);
        throw e;
      }
    },
    [mutate],
  );

  return {createCheckout, data, loading, error};
};

export const useUpdateCheckout = () => {
  const [mutate, {data, loading, error}] = useMutation(UPDATE_CHECKOUT);

  const updateCheckout = useCallback(
    async (checkoutId, email, billingAddress, shippingAddress) => {
      try {
        const response = await mutate({
          variables: {checkoutId, email, billingAddress, shippingAddress},
        });
        console.log('Checkout updated successfully', response.data);
        return response.data.Checkout.UpdateCheckout;
      } catch (e) {
        console.error('Error updated checkout', e);
        throw e;
      }
    },
    [mutate],
  );

  return {updateCheckout, data, loading, error};
};

export const useCheckoutInitPaymentKlarna = () => {
  const [mutate, {data, loading, error}] = useMutation(
    CHECKOUT_INIT_PAYMENT_KLARNA,
  );

  const checkoutInitPaymentKlarna = useCallback(
    async (checkoutId, countryCode, href, email) => {
      try {
        const response = await mutate({
          variables: {checkoutId, countryCode, href, email},
        });
        console.log(
          'Checkout init payment with klarna successfully',
          response.data,
        );
        return response.data.Payment.CreatePaymentKlarna;
      } catch (e) {
        console.error('Error updated checkout init payment with klarna ', e);
        throw e;
      }
    },
    [mutate],
  );

  return {checkoutInitPaymentKlarna, data, loading, error};
};

export const useCheckoutInitPaymentStripe = () => {
  const [mutate, {data, loading, error}] = useMutation(
    CHECKOUT_INIT_PAYMENT_STRIPE,
  );

  const checkoutInitPaymentStripe = useCallback(
    async (email, paymentMethod, successUrl, checkoutId) => {
      try {
        const response = await mutate({
          variables: {email, paymentMethod, successUrl, checkoutId},
        });
        console.log(
          'Checkout init payment with stripe successfully',
          response.data,
        );
        return response.data.Payment.CreatePaymentStripe;
      } catch (e) {
        console.error('Error updated checkout init payment with stripe ', e);
        throw e;
      }
    },
    [mutate],
  );

  return {checkoutInitPaymentStripe, data, loading, error};
};

export const useCheckoutPaymentIntentStripe = () => {
  const [mutate, {data, loading, error}] = useMutation(
    CHECKOUT_PAYMENT_INTENT_STRIPE,
  );

  const checkoutPaymentIntentStripe = useCallback(
    async (checkoutId, returnEphemeralKey) => {
      try {
        const response = await mutate({
          variables: {checkoutId, returnEphemeralKey},
        });
        console.log(
          'Checkout init payment intent with stripe successfully',
          response.data,
        );
        return response.data.Payment.CreatePaymentIntentStripe;
      } catch (e) {
        console.error(
          'Error updated checkout init payment intent with stripe ',
          e,
        );
        throw e;
      }
    },
    [mutate],
  );

  return {checkoutPaymentIntentStripe, data, loading, error};
};
