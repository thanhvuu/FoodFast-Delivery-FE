import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  HomeScreen,
  FoodDetailScreen,
  ContactScreen,
  TrackingScreen,
  AuthScreen,
  CartScreen,
  CheckoutScreen,
  AccountScreen,
  OrderHistoryScreen,
  AdminDashboardScreen,
  AdminRestaurantsScreen,
  AdminAccountScreen,
  RestaurantOverviewScreen,
  RestaurantOrdersScreen,
  RestaurantAccountScreen,
} from '../screen';
import { useAuth } from '../context';
import colors from '../theme/colors';
import { AdminTabParamList, RestaurantTabParamList, RootStackParamList } from './types';

export type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AdminTabs = createBottomTabNavigator<AdminTabParamList>();
const RestaurantTabs = createBottomTabNavigator<RestaurantTabParamList>();

const tabBarOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: {
    height: 72,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 6,
    paddingBottom: 12,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.muted,
};

const AdminTabNavigator: React.FC = () => (
  <AdminTabs.Navigator screenOptions={tabBarOptions}>
    <AdminTabs.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Tổng quan' }} />
    <AdminTabs.Screen
      name="AdminRestaurants"
      component={AdminRestaurantsScreen}
      options={{ title: 'Nhà hàng' }}
    />
    <AdminTabs.Screen name="AdminAccount" component={AdminAccountScreen} options={{ title: 'Hồ sơ' }} />
  </AdminTabs.Navigator>
);

const RestaurantTabNavigator: React.FC = () => (
  <RestaurantTabs.Navigator screenOptions={tabBarOptions}>
    <RestaurantTabs.Screen
      name="RestaurantOverview"
      component={RestaurantOverviewScreen}
      options={{ title: 'Nhà hàng' }}
    />
    <RestaurantTabs.Screen
      name="RestaurantOrders"
      component={RestaurantOrdersScreen}
      options={{ title: 'Đơn hàng' }}
    />
    <RestaurantTabs.Screen
      name="RestaurantAccount"
      component={RestaurantAccountScreen}
      options={{ title: 'Tài khoản' }}
    />
  </RestaurantTabs.Navigator>
);

const CustomerStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="Contact" component={ContactScreen} />
    <Stack.Screen name="Tracking" component={TrackingScreen} />
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
  </Stack.Navigator>
);

const AuthStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Auth" component={AuthScreen} />
  </Stack.Navigator>
);

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
      {user ? (
        user.role === 'admin' ? (
          <AdminTabNavigator />
        ) : user.role === 'restaurant' ? (
          <RestaurantTabNavigator />
        ) : (
          <CustomerStackNavigator />
        )
      ) : (
        <AuthStackNavigator />
      )}
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