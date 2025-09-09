/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {useCheckoutPaymentIntentStripe} from '../../../../../graphql/hooks/checkout';
import {useCart} from '../../../../../context/cartContext';

// Normalize possible SDK/backend keys
const normalizeStripeIntent = (res = {}) => {
  const clientSecret =
    res?.payment_intent_client_secret ||
    res?.client_secret ||
    res?.paymentIntentClientSecret;

  const customerId = res?.customer_id || res?.customerId;
  const ephemeralKey = res?.ephemeral_key || res?.ephemeralKey;

  return {clientSecret, customerId, ephemeralKey};
};

const formatPaymentOption = po => (po?.label ? po.label : 'Payment method');

export const StripeSDKPaymentButton = ({
  email,
  totalAmount,
  currency,
  onChangeMethod = () => {}, // e.g., setSelectedProvider('klarna') or open provider picker
}) => {
  const {
    state: {checkout},
  } = useCart();
  const {id: checkoutId} = checkout;

  const stripe = useStripe();
  const {checkoutPaymentIntentStripe} = useCheckoutPaymentIntentStripe();

  const [loading, setLoading] = useState(false);
  const [sheetReady, setSheetReady] = useState(false);
  const [paymentOption, setPaymentOption] = useState(null); // chosen method after step 1

  // 1) Initialize PaymentSheet in customFlow (two-step) mode
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await checkoutPaymentIntentStripe(checkoutId, true);
        const {clientSecret, customerId, ephemeralKey} =
          normalizeStripeIntent(res);
        if (!clientSecret)
          throw new Error('Missing client secret from stripeIntent response');

        const params = {
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Demo Shop',
          customFlow: true, // ⬅️ key: choose method first, confirm later
        };
        if (customerId && ephemeralKey) {
          params.customerId = customerId;
          params.customerEphemeralKeySecret = ephemeralKey;
        }

        const {error} = await stripe.initPaymentSheet(params);
        if (error) {
          console.error('[Stripe] initPaymentSheet error:', error);
          setSheetReady(false);
          return;
        }
        setSheetReady(true);
      } catch (err) {
        console.error('[Stripe] init error:', err);
        setSheetReady(false);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [checkoutId, checkoutPaymentIntentStripe, stripe]);

  // 2) Open selector: on close, read chosen option; on cancel, return to provider selector
  const openSelector = async () => {
    setLoading(true);
    const {error} = await stripe.presentPaymentSheet();
    setLoading(false);

    if (error) {
      // iOS: swipe-down; Android: Back button → treat as cancel and go back
      const code = String(error.code || '').toLowerCase();
      const msg = String(error.message || '').toLowerCase();
      const canceled = code.includes('cancel') || msg.includes('cancel');
      if (canceled) {
        onChangeMethod();
        return;
      }
      console.error('[Stripe] presentPaymentSheet error:', error);
      Alert.alert('Payment', 'Could not open payment selector.');
      return;
    }

    // Read the selected option (Apple Pay / card ****4242 / Link, etc.)
    const {error: optErr, paymentOption: po} =
      await stripe.retrievePaymentSheetPaymentOption();
    if (optErr) {
      console.error(
        '[Stripe] retrievePaymentSheetPaymentOption error:',
        optErr,
      );
      setPaymentOption(null);
      return;
    }
    setPaymentOption(po || null);
  };

  // 3) Confirm payment from your UI (only if a method is selected)
  const confirmNow = async () => {
    setLoading(true);
    const {error} = await stripe.confirmPaymentSheetPayment();
    setLoading(false);

    if (error) {
      console.error('[Stripe] confirm error:', error);
      Alert.alert('Payment', 'Payment failed. Please try again.');
      return;
    }
    Alert.alert('Payment', 'Payment successful!');
    // Optional: navigate to "Thank you", clear cart, etc.
  };

  return (
    <View style={styles.container}>
      {/* Device-friendly hint */}
      <Text style={styles.hint}>
        {Platform.OS === 'ios'
          ? 'iPhone: you can dismiss Stripe by swiping down.'
          : 'Android: you can dismiss Stripe with the Back button.'}
      </Text>

      {/* Step 1: choose/change method (opens/closes the sheet) */}
      <Button
        title={
          paymentOption ? 'Change payment method' : 'Choose payment method'
        }
        onPress={openSelector}
        disabled={loading || !sheetReady}
      />

      {/* Selected method summary */}
      {paymentOption ? (
        <View style={styles.methodRow}>
          <Text style={styles.methodLabel}>Selected:</Text>
          <Text style={styles.methodValue}>
            {formatPaymentOption(paymentOption)}
          </Text>
        </View>
      ) : null}

      {/* Step 2: confirm payment (only when a method is chosen) */}
      <View style={{marginTop: 10}}>
        <Button
          title={`Pay ${currency} ${Number(totalAmount).toFixed(2)}`}
          onPress={confirmNow}
          disabled={loading || !sheetReady || !paymentOption}
        />
      </View>

      {/* Quick exit back to provider selector (e.g., to switch to Klarna) */}
      <TouchableOpacity onPress={onChangeMethod} style={{marginTop: 8}}>
        <Text style={{color: '#007bff', fontWeight: '600'}}>
          Change provider
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center', marginTop: 12},
  hint: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  methodRow: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f2f5',
    maxWidth: '90%',
  },
  methodLabel: {fontWeight: '600', color: '#333'},
  methodValue: {marginTop: 2, color: '#333'},
});
