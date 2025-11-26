export type CustomerHomeStackParamList = {
  Home: undefined;
  CategoryListing: { category: string } | undefined;
  FoodDetail: { id?: string; category?: string } | undefined;
  Contact: undefined;
  Tracking: { orderId?: string } | undefined;
  Account: undefined;
  OrderHistory: undefined;
};

export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
  Tracking: { orderId?: string } | undefined;
};

export type OrdersStackParamList = {
  Orders: undefined;
  Tracking: { orderId?: string } | undefined;
};

export type AccountStackParamList = {
  Account: undefined;
  Tracking: { orderId?: string } | undefined;
  OrderHistory: undefined;
};

export type CustomerTabParamList = {
  HomeTab: undefined;
  OrdersTab: undefined;
  CartTab: undefined;
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
