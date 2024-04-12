import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, Modal} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {useCheckoutPaymentIntentStripe} from '../../../../../graphql/hooks/checkout';
import {useCart} from '../../../../../context/cartContext';

export const StripeSDKPaymentButton = ({email, totalAmount, currency}) => {
  const {
    state: {checkout},
  } = useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const stripe = useStripe();
  const {checkoutPaymentIntentStripe} = useCheckoutPaymentIntentStripe();
  const {id: checkoutId} = checkout;

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      setLoading(true);
      try {
        const clientSecret = await checkoutPaymentIntentStripe(checkoutId);
        const {error} = await stripe.initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Demo Shop',
        });
        if (error) {
          console.error('Error initializing payment sheet:', error);
          setPaymentSuccess(false);
        }
      } catch (error) {
        console.error('Failed to fetch payment intent:', error);
        setPaymentSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [checkoutId, checkoutPaymentIntentStripe, stripe]);

  const handlePress = async () => {
    setLoading(true);
    const {error} = await stripe.presentPaymentSheet();
    if (error) {
      console.error('Payment failed:', error);
      setPaymentSuccess(false);
    } else {
      setPaymentSuccess(true);
    }
    setLoading(false);
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={handlePress}
        title={`Pay ${currency} ${totalAmount.toFixed(2)}`}
        disabled={loading}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalView}>
          {paymentSuccess ? (
            <Text style={styles.successMessage}>Payment Successful!</Text>
          ) : (
            <Text style={styles.errorMessage}>
              Payment Failed. Please try again.
            </Text>
          )}
          <Button title="Close" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successMessage: {
    fontSize: 18,
    color: 'green',
    marginBottom: 15,
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    marginBottom: 15,
  },
});
