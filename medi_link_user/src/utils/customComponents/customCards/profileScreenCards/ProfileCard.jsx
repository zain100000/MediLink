import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {globalStyles} from '../../../../styles/globalStyles';
import {theme} from '../../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const ProfileScreenCard = ({
  title,
  iconName,
  navigationTarget,
  rightIcon,
  iconColor,
  textColor,
  onPressFunction,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (navigationTarget) {
      navigation.navigate(navigationTarget);
    } else if (onPressFunction) {
      onPressFunction();
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.primaryContainer]}>
      <View style={styles.cardContainer}>
        <View style={styles.cardLeftContainer}>
          <View style={styles.cardIconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons
                name={iconName || 'cog-outline'}
                size={width * 0.06}
                style={[
                  styles.cardIcon,
                  {
                    color: iconColor,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.cardTextContainer}>
            <Text
              style={[
                styles.cardTitle,
                {
                  color: textColor,
                },
              ]}>
              {title || 'Default Title'}
            </Text>
          </View>
        </View>

        <View style={styles.cardRightContainer}>
          <View style={styles.cardIconContainer}>
            <TouchableOpacity onPress={handlePress}>
              <Ionicons
                name={rightIcon || 'chevron-forward'}
                size={width * 0.064}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreenCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
  },

  cardLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: height * 0.01,
    gap: theme.gap(2),
  },

  cardIcon: {
    top: height * 0.002,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: height * 0.0042,
    borderRadius: height * 0.0042 * 6, // Make it full round
  },

  cardTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
    top: height * 0.002,
  },
});
