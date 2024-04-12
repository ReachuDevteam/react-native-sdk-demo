import {useLazyQuery, useQuery} from '@apollo/client';
import {
  CHANNEL_GET_PRODUCTS_QUERY,
  CHANNEL_GET_PRODUCT_QUERY,
} from '../querys/product';
import {Product} from '../../models/product';
import {useCallback} from 'react';

export const useChannelGetProducts = (currency, imageSize = 'large') => {
  const {loading, error, data} = useQuery(CHANNEL_GET_PRODUCTS_QUERY, {
    variables: {currency, imageSize},
    fetchPolicy: 'network-only', // It only makes the call on the network, it does not use the cache.
    nextFetchPolicy: 'cache-only', // After the first fetch, it only uses the cache
  });

  const products = data
    ? data.channelGetProducts.map(product => Product.fromJson(product))
    : [];

  return {loading, error, products};
};

export const useChannelGetProduct = () => {
  const [query, {loading, error, data}] = useLazyQuery(
    CHANNEL_GET_PRODUCT_QUERY,
  );

  const executeChannelGetProduct = useCallback(
    async (productId, currency = null, imageSize = 'large') => {
      try {
        const response = await query({
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-only',
          variables: {
            currency: currency,
            imageSize: imageSize,
            productId: productId,
          },
        });
        console.log('Return product successfully', response);
        const product = response?.data?.channelGetProduct
          ? Product.fromJson(response.data.channelGetProduct)
          : null;
        return product;
      } catch (e) {
        console.error('Error return product', e);
        throw e;
      }
    },
    [query],
  );

  return {executeChannelGetProduct, data, loading, error};
};
