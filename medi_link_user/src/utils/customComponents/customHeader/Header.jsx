import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const Header = ({
  title,
  logo,
  leftIcon,
  onPressLeft,
  rightIcon,
  onPressRight,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          transform: [{scale: scaleAnim}],
          opacity: fadeAnim,
        },
      ]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.leftGroup}>
          {leftIcon && (
            <TouchableOpacity onPress={onPressLeft} activeOpacity={0.8}>
              {React.isValidElement(leftIcon) ? (
                leftIcon
              ) : (
                <Image
                  source={leftIcon}
                  style={[styles.icon, {tintColor: theme.colors.white}]}
                />
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.logoTitleGroup}>
          {logo && <Image source={logo} style={styles.logo} />}
          <Text style={[styles.title, {color: theme.colors.white}]}>
            {title}
          </Text>
        </View>

        <View style={styles.rightGroup}>
          {rightIcon && (
            <TouchableOpacity onPress={onPressRight} activeOpacity={0.8}>
              {React.isValidElement(rightIcon) ? (
                rightIcon
              ) : (
                <Image
                  source={rightIcon}
                  style={[styles.icon, {tintColor: theme.colors.white}]}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    borderBottomLeftRadius: theme.borderRadius.large,
    borderBottomRightRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.elevation.depth2,
  },

  gradientBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
  },

  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },

  logoTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.025,
    flex: 1,
    marginLeft: width * 0.04,
  },

  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },

  logo: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: 'contain',
  },

  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilyBold,
  },

  icon: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },
});
