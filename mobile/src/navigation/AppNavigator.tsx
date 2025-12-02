import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  HomeScreen,
  CategoryScreen,
  FoodDetailScreen,
  ContactScreen,
  TrackingScreen,
  AuthScreen,
  CartScreen,
  CheckoutScreen,
  AccountScreen,
  OrderHistoryScreen,
  NotificationScreen,
  AdminDashboardScreen,
  AdminRestaurantsScreen,
  AdminAccountScreen,
  RestaurantOverviewScreen,
  RestaurantOrdersScreen,
  RestaurantAccountScreen,
  RestaurantMenuScreen,
} from '../screen';
import { useAuth } from '../context';
import colors from '../theme/colors';
import {
  AccountStackParamList,
  AdminTabParamList,
  CartStackParamList,
  CustomerHomeStackParamList,
  CustomerTabParamList,
  OrdersStackParamList,
  RestaurantTabParamList,
} from './types';

const HomeStack = createNativeStackNavigator<CustomerHomeStackParamList>();
const AdminTabs = createBottomTabNavigator<AdminTabParamList>();
const RestaurantTabs = createBottomTabNavigator<RestaurantTabParamList>();
const CustomerTabs = createBottomTabNavigator<CustomerTabParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const CartStack = createNativeStackNavigator<CartStackParamList>();
const AccountStack = createNativeStackNavigator<AccountStackParamList>();
const AuthStack = createNativeStackNavigator();

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

const CustomerHomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="CategoryListing" component={CategoryScreen} />
    <HomeStack.Screen name="FoodDetail" component={FoodDetailScreen} />
    <HomeStack.Screen name="RestaurantMenu" component={RestaurantMenuScreen} />
    <HomeStack.Screen name="Contact" component={ContactScreen} />
    <HomeStack.Screen name="Tracking" component={TrackingScreen} />
  </HomeStack.Navigator>
);

const OrdersStackNavigator: React.FC = () => (
  <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
    <OrdersStack.Screen name="Orders" component={OrderHistoryScreen} />
    <OrdersStack.Screen name="Tracking" component={TrackingScreen} />
  </OrdersStack.Navigator>
);

const AccountStackNavigator: React.FC = () => (
  <AccountStack.Navigator screenOptions={{ headerShown: false }}>
    <AccountStack.Screen name="Account" component={AccountScreen} />
    <AccountStack.Screen name="Tracking" component={TrackingScreen} />
    <AccountStack.Screen name="OrderHistory" component={OrderHistoryScreen} />
  </AccountStack.Navigator>
);

const CartStackNavigator: React.FC = () => (
  <CartStack.Navigator screenOptions={{ headerShown: false }}>
    <CartStack.Screen name="Cart" component={CartScreen} />
    <CartStack.Screen name="Checkout" component={CheckoutScreen} />
    <CartStack.Screen name="Tracking" component={TrackingScreen} />
  </CartStack.Navigator>
);

const CustomerTabNavigator: React.FC = () => (
  <CustomerTabs.Navigator
    screenOptions={{
      ...tabBarOptions,
      tabBarStyle: [
        tabBarOptions.tabBarStyle,
        {
          paddingTop: 8,
        },
      ],
    }}
  >
    <CustomerTabs.Screen
      name="HomeTab"
      component={CustomerHomeStackNavigator}
      options={{
        title: 'Home',
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🏠</Text>,
      }}
    />
    <CustomerTabs.Screen
      name="OrdersTab"
      component={OrdersStackNavigator}
      options={{
        title: 'Đơn hàng',
        tabBarLabel: 'Đơn hàng',
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🧾</Text>,
      }}
    />
    <CustomerTabs.Screen
      name="CartTab"
      component={CartStackNavigator}
      options={{
        title: 'Giỏ hàng',
        tabBarLabel: 'Giỏ hàng',
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🛒</Text>,
      }}
    />
    <CustomerTabs.Screen
      name="NotificationsTab"
      component={NotificationScreen}
      options={{
        title: 'Thông báo',
        tabBarLabel: 'Thông báo',
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🔔</Text>,
      }}
    />
    <CustomerTabs.Screen
      name="AccountTab"
      component={AccountStackNavigator}
      options={{
        title: 'Tôi',
        tabBarLabel: 'Tôi',
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>👤</Text>,
      }}
    />
  </CustomerTabs.Navigator>
);

const AuthStackNavigator: React.FC = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="Auth" component={AuthScreen} />
  </AuthStack.Navigator>
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
          <CustomerTabNavigator />
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
  tabIcon: {
    fontSize: 18,
  },
});

export default AppNavigator;