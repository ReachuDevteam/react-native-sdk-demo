import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useChannelGetProducts} from '../../../graphql/hooks/product';
import {useCart} from '../../../context/cartContext';
import ProductItem from './components/ProductItem';

export const ProductsScreen = () => {
  const {
    state: {selectedCurrency},
  } = useCart();
  const {loading, error, products} = useChannelGetProducts(selectedCurrency);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) {
    return <Text style={styles.errorText}>Error loading products!</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <FlatList
        data={products}
        renderItem={({item}) => <ProductItem product={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
