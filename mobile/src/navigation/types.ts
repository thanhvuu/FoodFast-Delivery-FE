export type CustomerHomeStackParamList = {
  Home: undefined;
  FoodDetail: { id: string } | undefined;
  Contact: undefined;
  Tracking: undefined;
  Cart: undefined;
  Checkout: undefined;
  Account: undefined;
  OrderHistory: undefined;
};

export type OrdersStackParamList = {
  Orders: undefined;
  Tracking: undefined;
};

export type AccountStackParamList = {
  Account: undefined;
  Tracking: undefined;
  OrderHistory: undefined;
};

export type CustomerTabParamList = {
  HomeTab: undefined;
  OrdersTab: undefined;
  NotificationsTab: undefined;
  AccountTab: undefined;
};

export type AdminTabParamList = {
  AdminDashboard: undefined;
  AdminRestaurants: undefined;
  AdminAccount: undefined;
};

export type RestaurantTabParamList = {
  RestaurantOverview: undefined;
  RestaurantOrders: undefined;
  RestaurantAccount: undefined;
};
