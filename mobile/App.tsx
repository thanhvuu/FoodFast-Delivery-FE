import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, CartProvider } from './src/context';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;