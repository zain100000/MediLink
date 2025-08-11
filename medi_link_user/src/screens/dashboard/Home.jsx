import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {getPatient} from '../../redux/slices/patientSlice';
import AppointmentCard from '../../utils/customComponents/customCards/appointmentCard/AppointmentCard';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [greeting, setGreeting] = useState('');
  const patient = useSelector(state => state.auth.patient);
  const patientProfile = useSelector(state => state.patient.patient);

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.primary);
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  useEffect(() => {
    if (patient?.id) {
      dispatch(getPatient(patient.id));
    }
  }, [dispatch, patient]);

  const handleNavigateAppointment = () => {
    navigation.navigate('Appointments');
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={globalStyles.container}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../assets/splashScreen/splash-logo.png')}
          title="Home"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.greetingContainer}>
          <View style={styles.greetingLeftContainer}>
            <Text style={styles.greetingTitle}>{greeting}!</Text>
            <Text style={styles.greetingDescription}>
              Let's get you a doctor's appointment!
              <Feather
                name={'calendar'}
                size={width * 0.044}
                color={theme.colors.white}
              />
            </Text>
          </View>
          <View style={styles.greetingRightContainer}>
            <TouchableOpacity activeOpacity={0.8}>
              <Image
                source={
                  patientProfile?.profilePicture
                    ? {uri: patientProfile.profilePicture}
                    : require('../../assets/placeholders/default-avatar.png')
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Appointment Card Section */}
        <View style={styles.cardContainer}>
          <AppointmentCard
            mainTitle={'Book an appointment'}
            subTitle={'Find a Doctor or specialist'}
            image={require('../../assets/icons/home-icon.png')}
            backgroundColor="#f8f3f8ff"
            onPress={handleNavigateAppointment}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: height * 0.01,
  },

  scrollContainer: {
    paddingBottom: height * 0.05,
  },

  greetingContainer: {
    marginTop: height * 0.04,
    paddingHorizontal: width * 0.06,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.gap(2),
  },

  greetingTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.white,
  },

  greetingDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.white,
  },

  profileImage: {
    width: width * 0.16,
    height: height * 0.076,
    resizeMode: 'cover',
    borderRadius: theme.borderRadius.circle,
  },

  cardContainer: {
    paddingHorizontal: width * 0.06,
    marginTop: height * 0.03,
  },
});
