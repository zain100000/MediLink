import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const DoctorCard = ({
  name,
  fee,
  imageUri,
  onPress,
  iconColor,
  activeOpacity = 0.85,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        {/* Profile Image or Placeholder */}
        <View style={styles.avatarContainer}>
          {imageUri ? (
            <Image source={{uri: imageUri}} style={styles.avatar} />
          ) : (
            <MaterialCommunityIcons
              name="account"
              size={width * 0.14}
              color={iconColor || theme.colors.white}
              style={styles.avatarFallback}
            />
          )}
        </View>

        {/* Doctor Info */}
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{name}</Text>
          {fee && <Text style={styles.feeText}>Fee: Rs {fee}</Text>}
        </View>

        {/* Right Arrow */}
        <MaterialCommunityIcons
          name="chevron-right"
          size={width * 0.06}
          color={theme.colors.white}
        />
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: height * 0.01,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },

  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: 14,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.018,
  },

  avatarContainer: {
    width: width * 0.16,
    height: width * 0.16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.08,
    backgroundColor: theme.colors.primary,
    marginRight: width * 0.04,
  },
  
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.08,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },

  textContainer: {
    flex: 1,
  },

  nameText: {
    fontSize: width * 0.045,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.white,
  },

  feeText: {
    fontSize: width * 0.037,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyMedium,
    opacity: 0.85,
    marginTop: height * 0.002,
  },

  avatarFallback: {
    opacity: 0.9,
  },
});
