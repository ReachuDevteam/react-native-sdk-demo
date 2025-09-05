import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from '@rneui/themed';
import {useCart, actions} from '../../context/cartContext';

const tabs = [
  {name: 'Products', icon: 'home', type: 'font-awesome'},
  {name: 'Shipping', icon: 'truck', type: 'font-awesome'},
  {name: 'Checkout', icon: 'shopping-cart', type: 'font-awesome'},
  {name: 'Payment', icon: 'credit-card', type: 'font-awesome'},
];

const FooterNavigation = () => {
  const {dispatch} = useCart();
  const [activeTab, setActiveTab] = useState('Products');
  const applySetScreen = screen => {
    setActiveTab(screen);
    dispatch({type: actions.SET_SELECTED_SCREEN, payload: screen});
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tab}
          onPress={() => applySetScreen(tab.name)}>
          <Icon
            name={tab.icon}
            type={tab.type}
            size={24}
            color={activeTab === tab.name ? '#007bff' : 'gray'}
          />
          <Text style={styles.text(activeTab === tab.name)}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  tab: {
    alignItems: 'center',
  },
  text: isActive => ({
    color: isActive ? '#007bff' : 'gray',
    fontSize: 12,
    marginTop: 4,
  }),
});

export default FooterNavigation;
