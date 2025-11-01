import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAppointments,
  clearAppointmentError,
} from '../../../redux/slices/appointmentSlice';
import Header from '../../../utils/customComponents/customHeader/Header';
import {theme} from '../../../styles/theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {globalStyles} from '../../../styles/globalStyles';

const {width, height} = Dimensions.get('window');

const MyAppointments = ({navigation}) => {
  const dispatch = useDispatch();
  const {appointments, loading, error} = useSelector(
    state => state.appointment,
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;


  console.log("APPOINTMENTS", )

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.primary);
    dispatch(getAppointments());

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    return () => dispatch(clearAppointmentError());
  }, [dispatch]);

  const renderAppointment = (appointment, index) => {
    const animStyle = {
      opacity: fadeAnim,
      transform: [
        {
          translateY: translateYAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30 * (index + 1), 0],
          }),
        },
      ],
    };

    return (
      <Animated.View key={appointment._id} style={[styles.card, animStyle]}>
        <View style={styles.cardHeader}>
          <Image
            source={
              appointment.doctor.profilePicture
                ? {uri: appointment.doctor.profilePicture}
                : require('../../../assets/placeholders/default-avatar.png')
            }
            style={styles.doctorImage}
          />
          <View style={{marginLeft: width * 0.03}}>
            <Text style={styles.doctorName}>{appointment.doctor.fullName}</Text>
            <Text style={styles.specialization}>
              {appointment.doctor.specialization}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.dateTime}>
            Date: {new Date(appointment.appointmentDate).toLocaleDateString()} |
            Time: {appointment.appointmentTime}
          </Text>
          <Text style={styles.reason}>
            Reason: {appointment.reasonForVisit}
          </Text>
          <Text
            style={[
              styles.status,
              appointment.status === 'CANCELLED'
                ? {color: theme.colors.error}
                : {},
            ]}>
            Status: {appointment.status}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.gradientHeader}>
        <Header
          logo={require('../../../assets/splashScreen/splash-logo.png')}
          title="Appointments"
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <Text style={styles.headerDescription}>List of all appointments.</Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error.message || error}</Text>
          </View>
        )}

        {!loading && !error && appointments.length === 0 && (
          <View style={styles.noAppointmentsContainer}>
            <Text style={styles.noAppointmentsText}>
              No appointments found.
            </Text>
          </View>
        )}

        {!loading &&
          !error &&
          appointments.map((appointment, index) =>
            renderAppointment(appointment, index),
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAppointments;

const styles = StyleSheet.create({
  gradientHeader: {
    paddingBottom: height * 0.02,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scrollContainer: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.05,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.dark,
    marginBottom: height * 0.01,
  },
  headerDescription: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.gray,
    marginBottom: height * 0.03,
  },
  card: {
    backgroundColor: theme.colors.secondaryLight,
    borderRadius: 15,
    padding: width * 0.04,
    marginBottom: height * 0.025,
    shadowColor: theme.colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  doctorImage: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  doctorName: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.dark,
  },
  specialization: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.gray,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray + '40',
    paddingTop: height * 0.01,
  },
  dateTime: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.dark,
    marginBottom: height * 0.005,
  },
  reason: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.dark,
    marginBottom: height * 0.005,
  },
  status: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },
  errorContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
  },
  noAppointmentsContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },
  noAppointmentsText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray,
  },
});
