import React from 'react';
import {useCart} from '../../../context/cartContext';
import {ProductsScreen} from '../Products';
import {PaymentScreen} from '../Payment';
import {CheckoutScreen} from '../Checkout';
import {ShippingScreen} from '../Shipping';
import {StyleSheet, View} from 'react-native';

export const ScreenContainer = ({style}) => {
  const {state} = useCart();

  switch (state.selectedScreen) {
    case 'Products':
      return (
        <View style={[styles.container, style]}>
          <ProductsScreen />
        </View>
      );
    case 'Shipping':
      return (
        <View style={[styles.container, style]}>
          <ShippingScreen />
        </View>
      );
    case 'Checkout':
      return (
        <View style={[styles.container, style]}>
          <CheckoutScreen />
        </View>
      );
    case 'Payment':
      return (
        <View style={[styles.container, style]}>
          <PaymentScreen />
        </View>
      );
    default:
      return (
        <View style={[styles.container, style]}>
          <ProductsScreen />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
