import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {theme} from '../../../styles/theme';
import Header from '../../../utils/customComponents/customHeader/Header';
import {globalStyles} from '../../../styles/globalStyles';

const {width, height} = Dimensions.get('window');

const AppUsage = () => {
  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.primary);
  }, []);

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        styles.primaryContainer,
        {backgroundColor: theme.colors.white},
      ]}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../../assets/splashScreen/splash-logo.png')}
          title="Terms and Conditions"
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

      <View style={styles.headerTextContainer}>
        <Text style={[styles.headerTitleText, {color: theme.colors.dark}]}>
          Terms and Conditions
        </Text>
        <Text
          style={[styles.headerDescriptionText, {color: theme.colors.dark}]}>
          Rules and guidelines for using MediLink.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.heading, {color: theme.colors.dark}]}>
          Introduction
        </Text>
        <Text style={[styles.description, {color: theme.colors.dark}]}>
          By accessing and using MediLink, you agree to comply with these Terms
          and Conditions. Please read them carefully before booking appointments
          or using our services.
        </Text>

        <Text style={[styles.heading, {color: theme.colors.dark}]}>
          User Responsibilities
        </Text>
        <Text style={[styles.description, {color: theme.colors.dark}]}>
          Users must provide accurate personal and medical information, respect
          intellectual property rights, and comply with applicable laws while
          using MediLink.
        </Text>
        <View style={styles.bulletContainer}>
          <Ionicons
            name="person-outline"
            size={width * 0.06}
            color={theme.colors.primary}
            style={styles.bulletIcon}
          />
          <Text style={[styles.bulletText, {color: theme.colors.dark}]}>
            Ensure your account details remain confidential and do not share
            your credentials with others.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={width * 0.06}
            color={theme.colors.primary}
            style={styles.bulletIcon}
          />
          <Text style={[styles.bulletText, {color: theme.colors.dark}]}>
            Any misuse of the platform may result in account suspension or
            termination.
          </Text>
        </View>

        <Text style={[styles.heading, {color: theme.colors.dark}]}>
          Appointments and Payments
        </Text>
        <Text style={[styles.description, {color: theme.colors.dark}]}>
          All appointments booked through MediLink are subject to availability.
          Payments for consultations must be completed securely through our
          supported payment methods.
        </Text>
        <View style={styles.bulletContainer}>
          <Ionicons
            name="card-outline"
            size={width * 0.06}
            color={theme.colors.primary}
            style={styles.bulletIcon}
          />
          <Text style={[styles.bulletText, {color: theme.colors.dark}]}>
            Refunds and cancellations are subject to our refund and cancellation
            policy.
          </Text>
        </View>

        <Text style={[styles.heading, {color: theme.colors.dark}]}>
          Limitation of Liability
        </Text>
        <Text style={[styles.description, {color: theme.colors.dark}]}>
          MediLink is not responsible for any indirect, incidental, or
          consequential damages resulting from the use of our platform.
        </Text>
        <View style={styles.bulletContainer}>
          <Ionicons
            name="shield-outline"
            size={width * 0.06}
            color={theme.colors.primary}
            style={styles.bulletIcon}
          />
          <Text style={[styles.bulletText, {color: theme.colors.dark}]}>
            Users agree to use the platform at their own risk.
          </Text>
        </View>

        <Text style={[styles.heading, {color: theme.colors.dark}]}>
          Contact Us
        </Text>
        <Text style={[styles.description, {color: theme.colors.dark}]}>
          If you have any questions regarding these Terms and Conditions, please
          reach out to us at:
        </Text>
        <View style={styles.contactContainer}>
          <Ionicons
            name="mail-outline"
            size={width * 0.06}
            color={theme.colors.primary}
            style={styles.contactIcon}
          />
          <Text style={[styles.contactText, {color: theme.colors.dark}]}>
            support@medilink.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppUsage;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },
  headerTextContainer: {
    marginTop: height * 0.04,
    marginHorizontal: width * 0.04,
  },
  headerTitleText: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamilyBold,
  },
  headerDescriptionText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyMedium,
    top: height * 0.01,
  },
  contentContainer: {
    marginTop: height * 0.02,
    marginHorizontal: width * 0.04,
  },
  heading: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilySemiBold,
    marginVertical: height * 0.02,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    marginBottom: height * 0.02,
    lineHeight: theme.typography.lineHeight.md,
    textAlign: 'justify',
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.04,
  },
  bulletIcon: {
    right: width * 0.05,
  },
  bulletText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    lineHeight: theme.typography.lineHeight.md,
    textAlign: 'justify',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.03,
  },
  contactIcon: {
    marginRight: width * 0.03,
  },
  contactText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    lineHeight: theme.typography.lineHeight.md,
  },
});
