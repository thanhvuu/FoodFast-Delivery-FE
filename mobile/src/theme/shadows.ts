import { Platform } from 'react-native';

const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
    },
    android: {
      elevation: 6,
    },
    default: {},
  }),
};

export default shadows;