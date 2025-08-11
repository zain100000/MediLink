import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {theme} from '../../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const AppointmentCard = ({
  onPress,
  image,
  mainTitle,
  subTitle,
  backgroundColor,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: backgroundColor || '#F6F3FF',
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <View style={styles.iconContainer}>
          <Image source={image} style={styles.icon} />
        </View>

        <Text style={styles.mainTitle}>{mainTitle}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.42,
    borderRadius: theme.borderRadius.large,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.04,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  iconContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: theme.borderRadius.large,
    backgroundColor: '#E1DAFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },

  icon: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: 'contain',
  },

  mainTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.dark,
    lineHeight: height * 0.034,
  },
  
  subTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.grayDark,
    marginTop: height * 0.005,
  },
});

