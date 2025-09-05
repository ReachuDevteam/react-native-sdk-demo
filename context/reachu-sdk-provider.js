import React, {createContext, useContext, useMemo} from 'react';
import SdkClient from '@reachu/react-native-sdk';
import {API_TOKEN, GRAPHQL_SERVER_URL} from '../consts/env';

const TOKEN = API_TOKEN;
const ENDPOINT = GRAPHQL_SERVER_URL;

const ReachuSdkContext = createContext(null);

export const ReachuSdkProvider = ({children}) => {
  const sdk = useMemo(() => new SdkClient(TOKEN, ENDPOINT), []);

  return (
    <ReachuSdkContext.Provider value={sdk}>
      {children}
    </ReachuSdkContext.Provider>
  );
};

export function useReachuSdk() {
  const ctx = useContext(ReachuSdkContext);
  if (!ctx) {
    throw new Error('useReachuSdk debe usarse dentro de ReachuSdkProvider');
  }
  return ctx;
}
