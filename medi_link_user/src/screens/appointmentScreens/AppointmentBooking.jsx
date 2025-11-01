import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {createAppointment} from '../../redux/slices/appointmentSlice';
import Header from '../../utils/customComponents/customHeader/Header';
import Button from '../../utils/customComponents/customButton/Button';
import InputField from '../../utils/customComponents/customInputField/InputField';
import Logo from '../../assets/splashScreen/splash-logo.png';
import {theme} from '../../styles/theme';
import Toast from 'react-native-toast-message';

const {width, height} = Dimensions.get('screen');

const AppointmentBooking = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const {doctor} = route.params || {};
  const {patient} = useSelector(state => state.auth);

  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start();
  }, []);

  const handleBookAppointment = async () => {
    if (!doctor?._id || !patient?.id) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Doctor or patient details are incomplete.',
      });
      return;
    }

    if (!appointmentDate) {
      Toast.show({
        type: 'error',
        text1: 'Select Date',
        text2: 'Please choose an appointment date.',
      });
      return;
    }

    if (!appointmentTime) {
      Toast.show({
        type: 'error',
        text1: 'Select Time',
        text2: 'Please choose an appointment time.',
      });
      return;
    }

    if (!reasonForVisit.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Reason Required',
        text2: 'Please provide a brief reason for your visit.',
      });
      return;
    }

    const appointmentData = {
      patient: patient.id,
      doctor: doctor._id,
      appointmentDate,
      appointmentTime,
      reasonForVisit: reasonForVisit.trim(),
      status: 'PENDING',
    };

    setLoading(true);

    try {
      const resultAction = await dispatch(createAppointment(appointmentData));

      if (createAppointment.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: 'Appointment Booked!',
          text2: 'Your appointment was created successfully.',
        });

        setReasonForVisit('');

        setTimeout(() => {
          navigation.replace('Main');
        }, 3000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Booking Failed',
          text2: resultAction?.error?.message || 'Please try again.',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Unexpected Error',
        text2: 'Something went wrong. Try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAppointmentDate(selectedDate);
      // Add subtle animation when date changes
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formatted =
        (hours % 12 || 12) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes) +
        (hours >= 12 ? ' PM' : ' AM');
      setAppointmentTime(formatted);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#F8FAFF', '#EFF3FF', '#FFFFFF']}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <Header
            logo={Logo}
            title="Book Appointment"
            leftIcon={
              <MaterialCommunityIcons
                name="chevron-left"
                size={width * 0.06}
                color={theme.colors.white}
              />
            }
            onPressLeft={() => navigation.goBack()}
          />

          <Animated.ScrollView
            style={[
              styles.content,
              {opacity: fadeAnim, transform: [{translateY: slideUp}]},
            ]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Doctor Card with Enhanced Animation */}
            <Animated.View
              style={[styles.doctorCard, {transform: [{scale: cardScale}]}]}>
              <View style={styles.doctorIconContainer}>
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={width * 0.07}
                  color={theme.colors.white}
                />
              </View>
              <Text style={styles.doctorName}>{doctor?.fullName}</Text>
              <Text style={styles.specialization}>
                {doctor?.specialization || 'General Practitioner'}
              </Text>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {doctor?.experience} years
                </Text>
              </View>
            </Animated.View>

            <Text style={styles.sectionTitle}>Appointment Details</Text>

            {/* Date Picker with Enhanced Styling */}
            <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerLeftContent}>
                  <Feather
                    name="calendar"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.pickerLabel}>Appointment Date</Text>
                </View>
                <View style={styles.pickerRightContent}>
                  <Text style={styles.pickerValue}>
                    {appointmentDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            {showDatePicker && (
              <DateTimePicker
                value={appointmentDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={handleDateChange}
                accentColor={theme.colors.primary}
              />
            )}

            {/* Time Picker with Enhanced Styling */}
            <TouchableWithoutFeedback onPress={() => setShowTimePicker(true)}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerLeftContent}>
                  <Feather
                    name="clock"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.pickerLabel}>Preferred Time</Text>
                </View>
                <View style={styles.pickerRightContent}>
                  <Text style={styles.pickerValue}>{appointmentTime}</Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                accentColor={theme.colors.primary}
              />
            )}

            <Text style={styles.sectionTitle}>Additional Information</Text>

            {/* Reason Input with Character Counter */}
            <View style={styles.reasonContainer}>
              <InputField
                placeholder="Brief reason for your visit..."
                value={reasonForVisit}
                onChangeText={setReasonForVisit}
                multiline
                numberOfLines={3}
                maxLength={200}
                leftIcon={
                  <MaterialCommunityIcons
                    name="note-text-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                }
                style={styles.reasonInput}
              />
              <Text style={styles.charCounter}>
                {reasonForVisit.length}/200
              </Text>
            </View>

            {/* Enhanced Book Button with Icon */}
            <Animated.View style={{transform: [{scale: buttonScale}]}}>
              <Button
                title="Confirm Appointment"
                onPress={handleBookAppointment}
                width={width * 0.9}
                loading={loading}
                backgroundColor={theme.colors.primary}
                textColor={theme.colors.white}
                icon={
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={width * 0.04}
                    color={theme.colors.white}
                    style={styles.buttonIcon}
                  />
                }
                style={styles.bookButton}
              />
            </Animated.View>
          </Animated.ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default AppointmentBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing(2.5),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },

  doctorCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xlarge,
    paddingVertical: theme.spacing(3),
    marginBottom: theme.spacing(3),
    ...theme.elevation.depth4,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },

  doctorIconContainer: {
    backgroundColor: theme.colors.primary,
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
    ...theme.elevation.depth2,
  },

  doctorName: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.secondary,
    marginBottom: theme.spacing(0.3),
  },

  specialization: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.primary,
    marginBottom: theme.spacing(1),
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(0.5),
    borderRadius: theme.borderRadius.small,
  },

  ratingText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.dark,
    marginLeft: theme.spacing(0.5),
  },

  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.dark,
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(0.5),
  },

  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.8),
    marginBottom: theme.spacing(1.5),
    ...theme.elevation.depth1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  pickerLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  pickerLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.dark,
    marginLeft: theme.spacing(1.5),
  },

  pickerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pickerValue: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.primary,
    marginRight: theme.spacing(1),
  },

  reasonContainer: {
    marginBottom: theme.spacing(1),
  },

  reasonInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  charCounter: {
    textAlign: 'right',
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.gray,
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },

  bookButton: {
    marginTop: theme.spacing(2),
    alignSelf: 'center',
  },

  infoContainer: {
    marginTop: theme.spacing(3),
    paddingHorizontal: theme.spacing(1),
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },

  infoText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.gray,
    marginLeft: theme.spacing(1),
  },
});
