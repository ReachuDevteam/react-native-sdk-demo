import {useCallback, useEffect, useState} from 'react';
import {useReachuSdk} from '../../context/reachu-sdk-provider';
import {Product} from '../../models/product';

/** List products (was: useQuery CHANNEL_GET_PRODUCTS_QUERY) */
export const useChannelGetProducts = (currency, imageSize = 'large') => {
  const sdk = useReachuSdk();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(!!currency);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!currency) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await sdk.channel.product.get({
          currency,
          image_size: imageSize,
        });
        if (!cancelled) {
          setProducts(
            Array.isArray(list) ? list.map(p => Product.fromJson(p)) : [],
          );
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sdk, currency, imageSize]);

  return {loading, error, products};
};

/** Get single product lazily (was: useLazyQuery CHANNEL_GET_PRODUCT_QUERY) */
export const useChannelGetProduct = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeChannelGetProduct = useCallback(
    async (
      productId,
      currency = null,
      sku = null,
      barcode = null,
      imageSize = 'large',
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = {image_size: imageSize};
        if (currency) {
          params.currency = currency;
        }
        if (productId != null) {
          params.product_ids = [productId];
        }
        if (sku) {
          params.sku_list = [sku];
        }
        if (barcode) {
          params.barcode_list = [barcode];
        }

        let products = await sdk.channel.product.get(params);

        const product = products?.length > 0 ? products[0] : null;

        const mapped = product ? Product.fromJson(product) : null;
        setData(mapped);
        return mapped;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {executeChannelGetProduct, data, loading, error};
};
