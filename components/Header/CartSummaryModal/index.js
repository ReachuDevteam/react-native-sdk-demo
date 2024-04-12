import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Icon} from '@rneui/themed';
import {actions, useCart} from '../../../context/cartContext';
import {
  useRemoveItemFromCart,
  useUpdateItemToCart,
} from '../../../graphql/hooks/cartItem';

const CartSummaryModal = ({isVisible, onClose}) => {
  const {
    state: {cartItems, cartId},
    dispatch,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const _useRemoveItemFromCart = useRemoveItemFromCart();
  const _useUpdateItemToCart = useUpdateItemToCart();

  const handleRemoveItem = async (cartItemId, _cartId) => {
    try {
      setLoading(true);
      const result = await _useRemoveItemFromCart.removeItemFromCart(
        _cartId,
        cartItemId,
      );
      if (result != null) {
        dispatch({type: actions.REMOVE_CART_ITEM, payload: cartItemId});
      } else {
        throw new Error('Error removing product from cart: result is null');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeQuantity = async (cartItemId, _cartId, newQuantity) => {
    try {
      setLoading(true);
      const result = await _useUpdateItemToCart.updateItemToCart(
        _cartId,
        cartItemId,
        newQuantity,
      );
      if (result != null) {
        dispatch({
          type: actions.UPDATE_CART_ITEM_QUANTITY,
          payload: {
            cartItemId,
            quantity: newQuantity,
          },
        });
      } else {
        throw new Error('Error updating product from cart: result is null');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() =>
              item.quantity === 1
                ? null
                : handleChangeQuantity(
                    item.cartItemId,
                    cartId,
                    item.quantity - 1,
                  )
            }>
            <Icon
              name="minus-circle"
              type="font-awesome"
              size={20}
              color="#007bff"
            />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() =>
              handleChangeQuantity(item.cartItemId, cartId, item.quantity + 1)
            }>
            <Icon
              name="plus-circle"
              type="font-awesome"
              size={20}
              color="#007bff"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>{`${
          item.quantity
        } x ${item.unitPrice.toFixed(2)} ${item.currency}`}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveItem(item.cartItemId, cartId)}
        style={styles.deleteButton}>
        <Icon name="trash" type="font-awesome" size={20} color="#d9534f" />
      </TouchableOpacity>
    </View>
  );

  const getTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      .toFixed(2);
  };
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={item => item.cartItemId.toString()}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.subtotalText}>Subtotal: {getTotal()} NOK</Text>
            <Text style={styles.totalText}>Total: {getTotal()} NOK</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityText: {
    marginHorizontal: 10,
  },
  itemPrice: {
    marginTop: 5,
  },
  deleteButton: {
    padding: 6,
  },
  totalContainer: {
    borderTopColor: '#e1e1e1',
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
  },
  subtotalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  closeButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
});

export default CartSummaryModal;
