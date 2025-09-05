import {useCallback, useEffect, useState} from 'react';
import {useReachuSdk} from '../../context/reachu-sdk-provider';

/** Fetch cart line items grouped by supplier (normalized to camelCase) */
export const useCartGetLineItemsBySupplier = cartId => {
  const sdk = useReachuSdk();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(!!cartId);
  const [error, setError] = useState(null);

  const normalizeGroup = g => ({
    supplier: g?.supplier ?? null,
    lineItems: g?.lineItems ?? g?.line_items ?? [],
    availableShippings: g?.availableShippings ?? g?.available_shippings ?? [],
  });

  const refetch = useCallback(async () => {
    if (!cartId) {
      setGroups([]);
      setLoading(false);
      setError(null);
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const res = await sdk.cart.getLineItemsBySupplier({cart_id: cartId});
      const list = Array.isArray(res) ? res.map(normalizeGroup) : [];
      setGroups(list);
      return list;
    } catch (e) {
      setError(e);
      setGroups([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [sdk, cartId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {loading, error, groups, refetch};
};

/** Apply shipping selections: { cart_item_id -> shipping_id } (unchanged) */
export const useApplyShippingSelections = () => {
  const sdk = useReachuSdk();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeApply = useCallback(
    async (cartId, shippingByCartItemId) => {
      setLoading(true);
      setError(null);
      try {
        const tasks = Object.entries(shippingByCartItemId).map(
          ([cart_item_id, shipping_id]) =>
            sdk.cart.updateItem({cart_id: cartId, cart_item_id, shipping_id}),
        );
        const result = await Promise.all(tasks);
        setData(result);
        return result;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  return {executeApply, data, loading, error};
};
