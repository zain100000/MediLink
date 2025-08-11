import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons
import {theme} from '../../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const DepartmentCard = ({
  mainTitle,
  subTitle,
  iconName, // Changed from 'image' to 'iconName'
  iconColor, // New prop for icon color
  onPress,
  activeOpacity = 0.9,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={styles.cardContainer}>
      <View style={styles.cardLeftContainer}>
        {/* Container for the icon with a circular background */}
        <View style={styles.iconBackground}>
          <MaterialCommunityIcons
            name={iconName || 'body'} // Default icon if none is provided
            size={width * 0.06}
            style={[
              styles.cardIcon,
              {color: iconColor || theme.colors.primary},
            ]}
          />
        </View>

        <View style={styles.textContainer}>
          {mainTitle && <Text style={styles.mainTitle}>{mainTitle}</Text>}
          {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
        </View>
      </View>

      {/* Right container for the chevron icon */}
      <View style={styles.cardRightContainer}>
        <TouchableOpacity onPress={onPress}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={width * 0.06}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default DepartmentCard;

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
    borderColor: theme.colors.white,
    padding: height * 0.01,
    borderRadius: height * 0.0042 * 8,
  },

  mainTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
    top: height * 0.002,
    color: theme.colors.white,
  },

  subTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilySemiBold,
    top: height * 0.002,
  },
});
