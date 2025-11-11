export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  FoodDetail: { id: string } | undefined;
  Contact: undefined;
  Tracking: undefined;
  Cart: undefined;
  Checkout: undefined;
  Account: undefined;
  OrderHistory: undefined;
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
