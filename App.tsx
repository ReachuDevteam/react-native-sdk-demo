/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {ApolloProvider} from '@apollo/client';
import React from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import client from './graphql/client';
import {CartProvider} from './context/cartContext';
import {InitializationMain} from './components/InitializationMain';
import AppHeader from './components/Header';
import FooterNavigation from './components/FooterNavigation';
import {ScreenContainer} from './components/Screens/Container';
import {ReachuSdkProvider} from './context/reachu-sdk-provider';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <ReachuSdkProvider>
      <ApolloProvider client={client}>
        <CartProvider>
          <InitializationMain>
            <SafeAreaView style={[styles.container, backgroundStyle]}>
              <AppHeader title="Online Store" />
              <ScreenContainer style={styles.screenContainerPadding} />
              <FooterNavigation />
            </SafeAreaView>
          </InitializationMain>
        </CartProvider>
      </ApolloProvider>
    </ReachuSdkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainerPadding: {
    paddingBottom: 0,
  },
});

export default App;
