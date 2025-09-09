import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCheckoutInitPaymentKlarna} from '../../../../../graphql/hooks/checkout';
import {FAKE_RETURN_URL, REACHU_SERVER_URL} from '../../../../../consts/env';
import {useCart} from '../../../../../context/cartContext';

export const KlarnaPaymentButton = () => {
  const {
    state: {checkout, selectedCountry},
  } = useCart();

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [orderId, setOrderId] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const webRef = useRef(null);

  const {checkoutInitPaymentKlarna} = useCheckoutInitPaymentKlarna();

  const closeModal = () => {
    setShowWebView(false);
    setLoading(false);
    setCanGoBack(false);
  };

  useEffect(() => {
    const onBackPress = () => {
      if (!showWebView) return false;
      if (canGoBack && webRef.current) {
        webRef.current.goBack();
      } else {
        closeModal();
      }
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [showWebView, canGoBack]);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const result = await checkoutInitPaymentKlarna(
        checkout.id,
        selectedCountry.toUpperCase(),
        FAKE_RETURN_URL,
        checkout.email,
      );
      if (result?.order_id) {
        setOrderId(result.order_id);
        setUrl(
          `${REACHU_SERVER_URL}/api/checkout/${checkout.id}/payment-klarna-html-body`,
        );
        setShowWebView(true);
      }
    } catch (error) {
      console.error('Error initiating Klarna payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavChange = event => {
    setCanGoBack(event.canGoBack);
    const returnUrl = `${FAKE_RETURN_URL}?order_id=${orderId}&payment_processor=KLARNA`;
    if (event.url?.includes(returnUrl)) {
      closeModal();
      setPaymentSuccess(true);
    }
  };

  return (
    <View style={styles.container}>
      {!paymentSuccess && (
        <TouchableOpacity style={styles.payButton} onPress={initiatePayment}>
          <Text style={styles.payButtonText}>Pay with Klarna</Text>
        </TouchableOpacity>
      )}

      {showWebView && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showWebView}
          onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalRoot}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  if (canGoBack && webRef.current) {
                    webRef.current.goBack();
                  } else {
                    closeModal();
                  }
                }}
                style={styles.headerBtn}>
                <Icon
                  name={canGoBack ? 'chevron-left' : 'close'}
                  size={24}
                  color="#fff"
                />
                <Text style={styles.headerBtnText}>
                  {canGoBack ? 'Back' : 'Close'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Klarna</Text>

              <TouchableOpacity onPress={closeModal} style={styles.headerRight}>
                <Text style={styles.changeText}>Change method</Text>
              </TouchableOpacity>
            </View>

            <WebView
              ref={webRef}
              source={{uri: url}}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onNavigationStateChange={handleNavChange}
              startInLoadingState={false}
              style={styles.webView}
            />

            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color="#fff" size="large" />
              </View>
            )}
          </SafeAreaView>
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
  container: {alignItems: 'center', marginTop: 20},
  payButton: {backgroundColor: '#007bff', borderRadius: 5, padding: 10},
  payButtonText: {color: '#FFFFFF', fontSize: 16},

  modalRoot: {flex: 1, backgroundColor: '#000'},
  modalHeader: {
    height: 48,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerBtn: {flexDirection: 'row', alignItems: 'center'},
  headerBtnText: {color: '#fff', marginLeft: 6, fontSize: 16},
  headerTitle: {color: '#fff', fontSize: 16, fontWeight: '600'},
  headerRight: {padding: 6},
  changeText: {color: '#93C5FD', fontWeight: '600'},

  webView: {flex: 1, backgroundColor: '#fff'},

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17,24,39,0.35)',
  },

  successContainer: {alignItems: 'center', marginTop: 20},
  successText: {fontSize: 18, color: '#4CAF50', marginTop: 10},
});
