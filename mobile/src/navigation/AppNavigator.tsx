import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';
import FoodDetailScreen from '../screen/FoodDetailScreen';
import ContactScreen from '../screen/ContactScreen';
import TrackingScreen from '../screen/TrackingScreen';

export type RootStackParamList = {
  Home: undefined;
  FoodDetail: { id: string } | undefined;
  Contact: undefined;
  Tracking: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;