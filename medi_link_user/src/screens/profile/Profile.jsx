import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../styles/theme';
import Header from '../../utils/customComponents/customHeader/Header';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getPatient} from '../../redux/slices/patientSlice';
import ProfileHeaderCard from '../../utils/customComponents/customCards/profileScreenCards/ProfileHeaderCard';
import ProfileScreenCard from '../../utils/customComponents/customCards/profileScreenCards/ProfileCard';
import LogoutModal from '../../utils/customModals/LogoutModal';
import Toast from 'react-native-toast-message';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {width, height} = Dimensions.get('screen');

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loading = useSelector(state => state.patient.loading);
  const patient = useSelector(state => state.auth.patient);
  const patientProfile = useSelector(state => state.patient.patient);
  const profilePicture = useSelector(
    state => state.patient.patient?.profilePicture,
  );
  const name = useSelector(state => state.patient.patient?.fullName);
  const phone = useSelector(state => state.patient.patient?.phone);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const statusBarColor = theme.colors.primary;
    StatusBar.setBackgroundColor(statusBarColor);
  }, []);

  const handleProfileNavigate = () => {
    navigation.navigate('My_Account', {
      patient: patientProfile,
    });
  };

  useEffect(() => {
    if (patient && patient.id) {
      dispatch(getPatient(patient.id));
    }
  }, [dispatch, patient]);

  const handleLogoutModal = () => {
    setShowLogoutModal(true);
  };  

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../assets/splashScreen/splash-logo.png')}
          title="My Profile"
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileInfoContainer}>
          <ProfileHeaderCard
            image={profilePicture}
            name={name}
            phone={phone}
            btnTitle="Logout"
            onPress={handleLogoutModal}
          />
        </View>

        <View style={styles.profileCards}>
          <View style={styles.accountContainer}>
            <ProfileScreenCard
              title="My Account"
              iconName="person"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={handleProfileNavigate}
            />
          </View>

          <View style={styles.privacyPolicyContainer}>
            <ProfileScreenCard
              title="Privacy Policy"
              iconName="shield"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('Privacy_Policy')}
            />
          </View>

          <View style={styles.termsConditionContainer}>
            <ProfileScreenCard
              title="Terms & Conditions"
              iconName="briefcase"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('App_Usage')}
            />
          </View>

          <View style={styles.orderContainer}>
            <ProfileScreenCard
              title="My Appointments"
              iconName="calendar"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('My_Appointments')}
            />
          </View>
        </View>
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout!"
        description="Are you sure you want to logout?"
      />
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    marginBottom: height * 0.015,
    paddingBottom: height * 0.01,
  },

  scrollContent: {
    paddingBottom: height * 0.1,
  },

  sectionHeaderContainer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
  },

  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.tertiary,
  },

  headerDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.gray,
  },

  profileCards: {
    marginTop: height * 0.034,
    marginHorizontal: width * 0.04,
    gap: theme.gap(1),
  },
});
