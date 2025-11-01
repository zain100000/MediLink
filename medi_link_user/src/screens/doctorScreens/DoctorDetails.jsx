import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';

const {width, height} = Dimensions.get('screen');

const DoctorDetails = () => {
  const navigation = useNavigation();
  const {doctor} = useRoute().params || {};

  if (!doctor) {
    return (
      <SafeAreaView
        style={[globalStyles.container, {backgroundColor: theme.colors.white}]}>
        <Text
          style={{
            textAlign: 'center',
            marginTop: height * 0.4,
            color: theme.colors.primary,
          }}>
          No doctor details found.
        </Text>
      </SafeAreaView>
    );
  }

  const qualificationText = (() => {
    try {
      return JSON.parse(doctor.qualifications[0]).join(', ');
    } catch {
      return doctor.qualifications?.join(', ') || 'N/A';
    }
  })();

  const departmentText = (() => {
    try {
      return JSON.parse(doctor.departments[0]).join(', ');
    } catch {
      return doctor.departments?.join(', ') || 'N/A';
    }
  })();

  const handleBookAppointment = () => {
    navigation.navigate('Appointment_Booking', {doctor});
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.primaryContainer]}>
      {/* Header over image */}
      <View style={styles.imageContainer}>
        {doctor.profilePicture ? (
          <Image source={{uri: doctor.profilePicture}} style={styles.image} />
        ) : (
          <Image
            source={require('../../assets/placeholders/default-avatar.png')}
            style={styles.image}
          />
        )}
      </View>

      <View style={styles.headerContainer}>
        <Header
          logo={require('../../assets/splashScreen/splash-logo.png')}
          title="Doctor Details"
          leftIcon={
            <FontAwesome5
              name="chevron-left"
              size={width * 0.06}
              color={theme.colors.white}
            />
          }
          onPressLeft={() => navigation.goBack()}
        />
      </View>

      {/* Bottom sheet style detail area */}
      <View style={styles.bottomSheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{doctor.fullName}</Text>
          <Text style={styles.subtitle}>{doctor.specialization}</Text>

          {/* Department */}
          <View style={styles.infoRow}>
            <View style={styles.iconLabel}>
              <MaterialCommunityIcons
                name="office-building"
                size={width * 0.05}
                color={theme.colors.secondary}
              />
              <Text style={styles.infoLabel}>Department</Text>
            </View>
            <Text style={styles.infoValue}>{departmentText}</Text>
          </View>

          {/* Experience */}
          <View style={styles.infoRow}>
            <View style={styles.iconLabel}>
              <MaterialCommunityIcons
                name="briefcase-clock"
                size={width * 0.05}
                color={theme.colors.secondary}
              />
              <Text style={styles.infoLabel}>Experience</Text>
            </View>
            <Text style={styles.infoValue}>{doctor.experience} years</Text>
          </View>

          {/* Qualification */}
          <View style={styles.infoRow}>
            <View style={styles.iconLabel}>
              <FontAwesome5
                name="graduation-cap"
                size={width * 0.045}
                color={theme.colors.secondary}
              />
              <Text style={styles.infoLabel}>Qualification</Text>
            </View>
            <Text style={styles.infoValue}>{qualificationText}</Text>
          </View>

          {/* Address */}
          <View style={styles.infoRow}>
            <View style={styles.iconLabel}>
              <Feather
                name="map-pin"
                size={width * 0.05}
                color={theme.colors.secondary}
              />
              <Text style={styles.infoLabel}>Address</Text>
            </View>
            <Text style={styles.infoValue}>{doctor.address}</Text>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.price}>PKR {doctor.consultationFee}</Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleBookAppointment}
                style={[
                  styles.iconContainer,
                  {backgroundColor: theme.colors.primary},
                ]}>
                <Feather
                  name="calendar"
                  size={width * 0.06}
                  color={theme.colors.white}
                />
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => console.log('Contact pressed')}
                style={[
                  styles.iconContainer,
                  {backgroundColor: theme.colors.secondary},
                ]}>
                <Feather
                  name="phone"
                  size={width * 0.06}
                  color={theme.colors.white}
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DoctorDetails;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  imageContainer: {
    height: height * 0.5,
    width: '100%',
  },

  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: theme.borderRadius.large,
    borderBottomRightRadius: theme.borderRadius.large,
  },

  bottomSheet: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.04,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    marginTop: -height * 0.02,
  },

  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.primary,
    marginBottom: height * 0.004,
  },

  subtitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.tertiary,
    marginBottom: height * 0.018,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: height * 0.01,
  },

  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    width: '45%',
  },

  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.secondary,
    fontFamily: theme.typography.fontFamilyMedium,
  },

  infoValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamilyMedium,
    textAlign: 'right',
    flex: 1,
    marginLeft: width * 0.05,
  },

  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.03,
    justifyContent: 'space-between',
    paddingBottom: height * 0.02,
  },

  price: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.primary,
  },

  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.gap(2),
  },

  iconContainer: {
    padding: height * 0.014,
    borderRadius: theme.borderRadius.circle,
  },
});
