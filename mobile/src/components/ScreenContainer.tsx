import React, { PropsWithChildren } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import colors from '../theme/colors';

const ScreenContainer: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.wrapper}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wrapper: {
    flex: 1,
  },
});

export default ScreenContainer;