/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {Button} from '@rneui/themed';
import {useCart, actions} from '../../../context/cartContext';
import {
  useCartGetLineItemsBySupplier,
  useApplyShippingSelections,
} from '../../../graphql/hooks/shipping';

const formatPrice = (price, fallbackCurrency) => {
  const amt = price?.amount ?? 0;
  const curr = price?.currencyCode ?? fallbackCurrency ?? '';
  const n = Number(amt);
  return `${curr}${Number.isFinite(n) ? n.toFixed(2) : '0.00'}`;
};

export const ShippingScreen = () => {
  const {
    state: {cartId, selectedCurrency},
    dispatch,
  } = useCart();

  const {loading, error, groups, refetch} =
    useCartGetLineItemsBySupplier(cartId);
  const {executeApply, loading: applying} = useApplyShippingSelections();

  const [selectedBySupplier, setSelectedBySupplier] = useState({});
  const [shippingByCartItemId, setShippingByCartItemId] = useState({});

  const onSelectShippingForSupplier = ({supplierId, shippingId, lineItems}) => {
    setSelectedBySupplier(prev => ({...prev, [supplierId]: shippingId}));
    setShippingByCartItemId(prev => {
      const next = {...prev};
      (lineItems || []).forEach(li => {
        const cartItemId = li?.id ?? li?.cart_item_id;
        if (cartItemId) {
          next[cartItemId] = shippingId;
        }
      });
      return next;
    });
  };

  const applySelections = async () => {
    if (!Object.keys(shippingByCartItemId).length) {
      Alert.alert(
        'Select shipping',
        'Please choose at least one shipping option.',
      );
      return;
    }
    try {
      await executeApply(cartId, shippingByCartItemId);
      Alert.alert('Success', 'Shipping updated successfully.');
      dispatch({type: actions.SET_SELECTED_SCREEN, payload: 'Checkout'});
    } catch {
      Alert.alert('Error', 'Failed to apply shipping selections.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, styles.fill]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, styles.fill]}>
        <Text>Failed to load shippings.</Text>
        <Button
          title="Retry"
          onPress={refetch}
          containerStyle={{marginTop: 12}}
        />
        <Button
          type="outline"
          title="Back"
          onPress={() =>
            dispatch({type: actions.SET_SELECTED_SCREEN, payload: 'Products'})
          }
          containerStyle={{marginTop: 12}}
        />
      </View>
    );
  }

  if (!groups?.length) {
    return (
      <View style={[styles.center, styles.fill]}>
        <Text>No items to ship.</Text>
        <Button
          type="outline"
          title="Back"
          onPress={() =>
            dispatch({type: actions.SET_SELECTED_SCREEN, payload: 'Products'})
          }
          containerStyle={{marginTop: 12}}
        />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Select your shipping method</Text>

        {groups.map((group, idx) => {
          const supplier = group?.supplier || {};
          const supplierId = supplier?.id ?? 0;
          const supplierName = supplier?.name ?? 'Supplier';

          const items = group?.lineItems || [];
          const shippings = group?.availableShippings || [];

          const selectedId = selectedBySupplier[supplierId];

          return (
            <View style={styles.card} key={`${supplierId}-${idx}`}>
              <Text style={styles.supplierTitle}>Supplier: {supplierName}</Text>

              {/* Items summary */}
              <View style={styles.itemsWrap}>
                {items.map(li => (
                  <View
                    key={(li?.id ?? li?.cart_item_id)?.toString()}
                    style={styles.chip}>
                    <Text style={styles.chipText}>
                      {li?.title ?? 'Item'} •{' '}
                      {formatPrice(li?.price, selectedCurrency)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />

              {!shippings.length ? (
                <Text style={styles.noShippings}>
                  No shipping options available for this supplier.
                </Text>
              ) : (
                <View>
                  <Text style={styles.subTitle}>Available shippings:</Text>
                  {[...shippings]
                    .sort(
                      (a, b) =>
                        (a?.price?.amount ?? 0) - (b?.price?.amount ?? 0),
                    )
                    .map(s => {
                      const id = s?.id ?? '';
                      const onPick = () =>
                        onSelectShippingForSupplier({
                          supplierId,
                          shippingId: id,
                          lineItems: items,
                        });
                      return (
                        <TouchableOpacity
                          key={id}
                          style={styles.optionRow}
                          onPress={onPick}>
                          <View style={{flex: 1}}>
                            <Text style={styles.optionTitle}>
                              {s?.name ?? 'Shipping'}
                            </Text>
                            <Text style={styles.optionDesc} numberOfLines={2}>
                              {s?.description ? `${s.description}\n` : ''}
                              {formatPrice(s?.price, selectedCurrency)}
                            </Text>
                          </View>
                          <RadioButton
                            value={id}
                            status={selectedId === id ? 'checked' : 'unchecked'}
                            onPress={onPick}
                          />
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.footerBtns}>
          <Button
            type="outline"
            title="Back"
            onPress={() =>
              dispatch({type: actions.SET_SELECTED_SCREEN, payload: 'Products'})
            }
            buttonStyle={styles.btnOutline}
          />
          <Button
            title="Confirm shippings"
            onPress={applySelections}
            disabled={applying || !Object.keys(shippingByCartItemId).length}
            buttonStyle={styles.btnPrimary}
          />
        </View>
      </ScrollView>

      {applying && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fill: {flex: 1},
  center: {alignItems: 'center', justifyContent: 'center'},
  container: {flex: 1, padding: 20, paddingTop: 0},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 10},
  card: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  supplierTitle: {fontWeight: 'bold', fontSize: 16, marginBottom: 8},
  itemsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f0f2f5',
    borderRadius: 16,
  },
  chipText: {fontSize: 12, color: '#333'},
  divider: {height: 12},
  subTitle: {fontWeight: '600', marginBottom: 8},
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  optionTitle: {fontSize: 14, fontWeight: '600'},
  optionDesc: {color: '#666', marginTop: 2},
  noShippings: {color: '#999'},
  footerBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  btnPrimary: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 12,
  },
  btnOutline: {borderRadius: 6, paddingVertical: 12},
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
