import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCart} from '../../../../../context/cartContext';
import {useCheckoutInitPaymentStripe} from '../../../../../graphql/hooks/checkout';
import {FAKE_RETURN_URL} from '../../../../../consts/env';

export const StripePaymentButton = () => {
  const {
    state: {checkout},
  } = useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [_, setOrderId] = useState(-1);

  const {checkoutInitPaymentStripe} = useCheckoutInitPaymentStripe();

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const result = await checkoutInitPaymentStripe(
        checkout.email,
        'Stripe',
        FAKE_RETURN_URL,
        checkout.id,
      );
      if (result?.order_id) {
        setOrderId(result.order_id);
        setUrl(result.checkout_url);
        setShowWebView(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!paymentSuccess && (
        <TouchableOpacity style={styles.payButton} onPress={initiatePayment}>
          <Text style={styles.payButtonText}>Pay with Stripe SDK</Text>
        </TouchableOpacity>
      )}

      {showWebView && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showWebView}
          onRequestClose={() => {
            setShowWebView(false);
          }}>
          <WebView
            source={{uri: url}}
            onLoad={() => setLoading(false)}
            onNavigationStateChange={event => {
              if (event.url.includes(FAKE_RETURN_URL)) {
                setShowWebView(false);
                setPaymentSuccess(true);
              }
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{marginTop: 20}}
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#0000ff" size="large" />
            </View>
          )}
        </Modal>
      )}

      {paymentSuccess && (
        <View style={styles.successContainer}>
          <Icon name="check-circle" size={60} color="#4CAF50" />
          <Text style={styles.successText}>Payment Successful!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  payButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successText: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 10,
  },
});
