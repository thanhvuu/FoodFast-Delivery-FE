import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import HomeScreen from '../screen/HomeScreen';
import FoodDetailScreen from '../screen/FoodDetailScreen';
import ContactScreen from '../screen/ContactScreen';
import TrackingScreen from '../screen/TrackingScreen';
import AuthScreen from '../screen/AuthScreen';
import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  FoodDetail: { id: string } | undefined;
  Contact: undefined;
  Tracking: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <NavigationContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="Tracking" component={TrackingScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: colors.muted,
  },
});

export default AppNavigator;
