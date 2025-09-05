import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {useChannelGetProduct} from '../../../../../graphql/hooks/product';
import {useCart} from '../../../../../context/cartContext';

const ProductDetailModal = ({productId, isVisible, onClose}) => {
  const {
    state: {selectedCurrency},
  } = useCart();

  const {executeChannelGetProduct, loading, error, data} =
    useChannelGetProduct();

  const [productDetail, setProductDetail] = useState(data);

  useEffect(() => {
    if (isVisible && productId) {
      (async () => {
        const productData = await executeChannelGetProduct(
          productId,
          selectedCurrency,
        );

        if (productData) {
          setProductDetail(productData);
        }
      })();
    }
  }, [isVisible, productId, selectedCurrency, executeChannelGetProduct]);

  const modalDescriptionWidth = Dimensions.get('window').width;

  const htmlContent = productDetail?.description ?? '';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && (
              <Text style={styles.errorText}>
                Error loading product details.
              </Text>
            )}
            {productDetail?.id && (
              <>
                <Image
                  source={{uri: productDetail.imageUrl}}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{productDetail.title}</Text>
                <RenderHtml
                  contentWidth={modalDescriptionWidth}
                  source={{html: htmlContent}}
                />
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProductDetailModal;
