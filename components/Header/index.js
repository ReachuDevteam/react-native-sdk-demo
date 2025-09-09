import React, {useState} from 'react';
import {Header, Badge, Icon, Image} from '@rneui/themed';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {SELECT_CURRENCY} from '../../consts/env';
import {useCart} from '../../context/cartContext';
import CartSummaryModal from './CartSummaryModal';

const logo = require('../../images/logo-demo.png');
const countryFlag = require('../../images/flags/no.png');

const AppHeader = ({title}) => {
  const {
    state: {cartItems},
  } = useCart();
  const countSelectProducts = cartItems.length;
  const [isCartSummaryVisible, setIsCartSummaryVisible] = useState(false);

  const toggleCartSummaryModal = () => {
    setIsCartSummaryVisible(!isCartSummaryVisible);
  };

  return (
    <>
      <Header
        backgroundColor="#007bff"
        centerComponent={
          <View style={styles.centerWrap}>
            <Image
              source={logo}
              style={styles.logo}
              accessibilityLabel="Demo logo"
            />
            <Text style={styles.centerTitle}>{title}</Text>
          </View>
        }
        leftComponent={
          <TouchableOpacity onPress={toggleCartSummaryModal}>
            <View style={styles.leftComponentContainer}>
              <Icon
                name="shopping-cart"
                type="font-awesome"
                color="#fff"
                size={24}
              />
              <View style={styles.badgeContainer}>
                <Badge
                  value={countSelectProducts}
                  status="error"
                  textStyle={styles.badgeTextStyle}
                />
              </View>
            </View>
          </TouchableOpacity>
        }
        rightComponent={
          <View style={styles.leftComponentContainer}>
            <View>
              <Image source={countryFlag} style={styles.flagStyle} />
            </View>
            <View>
              <Badge
                value={SELECT_CURRENCY}
                status="warning"
                textStyle={styles.badgeCurrencyTextStyle}
              />
            </View>
          </View>
        }
      />

      <CartSummaryModal
        isVisible={isCartSummaryVisible}
        onClose={toggleCartSummaryModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  // centro
  centerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 28, // ajusta si quieres más grande
    height: 28,
    marginRight: 8,
    resizeMode: 'contain',
  },
  centerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // existentes
  leftComponentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    right: -15,
    top: -3,
    zIndex: 1,
  },
  badgeTextStyle: {
    fontSize: 10,
    color: 'white',
  },
  badgeCurrencyTextStyle: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  flagStyle: {
    width: 30,
    height: 20,
    marginRight: 6,
    resizeMode: 'contain',
  },
});

export default AppHeader;
