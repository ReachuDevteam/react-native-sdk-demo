import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useCart} from '../../../context/cartContext';
import {RadioButton} from 'react-native-paper';
import {StripePaymentButton} from './components/StripePaymentButton';
import {KlarnaPaymentButton} from './components/KlarnaPaymentButton';

export const PaymentScreen = () => {
  const {
    state: {cartItems, checkout, selectedCurrency},
  } = useCart();

  const [selectedProvider, setSelectedProvider] = useState('klarna');

  const providers = [
    {id: 'klarna', title: 'Klarna', component: KlarnaPaymentButton},
    {id: 'stripe', title: 'Stripe', component: StripePaymentButton},
  ];

  const {email, billingAddress, shippingAddress} = checkout;

  const totalNumber = cartItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
    0,
  );
  const total = totalNumber.toFixed(2);

  const renderPaymentButton = _providers => {
    const p = _providers.find(pr => pr.id === selectedProvider);
    if (!p) return null;

    const PaymentButtonComponent = p.component;

    const stripeProps = {
      email,
      totalAmount: totalNumber,
      currency: selectedCurrency,
      onChangeMethod: () => setSelectedProvider('klarna'),
    };

    return (
      <PaymentButtonComponent {...(p.id === 'stripe' ? stripeProps : {})} />
    );
  };

  const renderProductItem = ({item}) => (
    <View style={styles.productItem} key={item.cartItemId.toString()}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productQuantityPrice}>
          {`${item.quantity} x ${item.currency}${item.unitPrice}`}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Order</Text>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoContent}>{email}</Text>
        <Text style={styles.infoLabel}>Billing Address:</Text>
        <Text style={styles.infoContent}>
          {`${billingAddress.first_name} ${billingAddress.last_name}, ${billingAddress.address1}, ${billingAddress.city}`}
        </Text>
        <Text style={styles.infoLabel}>Shipping Address:</Text>
        <Text style={styles.infoContent}>
          {`${shippingAddress.first_name} ${shippingAddress.last_name}, ${shippingAddress.address1}, ${shippingAddress.city}`}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products</Text>
        {cartItems.map(item => renderProductItem({item}))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Payment Provider</Text>
        {providers.map(provider => (
          <TouchableOpacity
            key={provider.id}
            style={styles.providerOption}
            onPress={() => setSelectedProvider(provider.id)}>
            <Text style={styles.providerText}>{provider.title}</Text>
            <RadioButton
              value={provider.id}
              status={
                selectedProvider === provider.id ? 'checked' : 'unchecked'
              }
              onPress={() => setSelectedProvider(provider.id)}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalTitle}>Total:</Text>
        <Text style={styles.totalAmount}>
          {selectedCurrency}
          {total}
        </Text>
      </View>

      {renderPaymentButton(providers)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#f9f9fb',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#666',
    marginTop: 5,
  },
  infoContent: {
    color: '#333',
    marginTop: 2,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productQuantityPrice: {
    fontSize: 14,
    color: '#666',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 0,
    borderTopColor: '#fff',
  },
  totalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  checkoutButton: {
    marginTop: 30,
    paddingVertical: 8,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  providerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  providerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  providerText: {
    fontSize: 16,
  },
});

export default PaymentScreen;
