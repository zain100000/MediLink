import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {theme} from '../styles/theme';

/* Shared Imports */
import Splash from '../screens/shared/Splash';
import OnBoarding from '../screens/shared/OnBoarding';

// Auth Imports
import Signin from '../screens/auth/Signin';
import Signup from '../screens/auth/Signup';

// Dashboard Imports
import BottomNavigator from './bottomNavigator/BottomNavigator';

// Department Imports
import Department from '../screens/departmentScreens/Department';
import DepartmentDetails from '../screens/departmentScreens/DepartmentDetail';

// Doctor Imports
import DoctorDetails from '../screens/doctorScreens/DoctorDetails';
import AppointmentBooking from '../screens/appointmentScreens/AppointmentBooking';

// Profile Imports
import Account from '../screens/profile/profileSubScreens/Account';
import PrivacyPolicy from '../screens/profile/profileSubScreens/PrivacyPolicy';
import AppUsage from '../screens/profile/profileSubScreens/AppUsage';
import MyAppointments from '../screens/profile/profileSubScreens/MyAppointments';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [statusBarColor, setStatusBarColor] = useState(theme.colors.primary);

  return (
    <>
      <StatusBar backgroundColor={statusBarColor} barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        {/* Shared Routes */}
        <Stack.Screen name="Splash">
          {props => <Splash {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="OnBoard">
          {props => (
            <OnBoarding {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        {/* Auth Routes */}
        <Stack.Screen name="Signin">
          {props => <Signin {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Signup">
          {props => <Signup {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        {/* Dashboard Routes */}
        <Stack.Screen name="Main">
          {props => (
            <BottomNavigator {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        {/* Department Routes */}
        <Stack.Screen name="Departments">
          {props => (
            <Department {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Department_Details">
          {props => (
            <DepartmentDetails
              {...props}
              setStatusBarColor={setStatusBarColor}
            />
          )}
        </Stack.Screen>

        {/* Doctor Routes */}
        <Stack.Screen name="Doctor_Details">
          {props => (
            <DoctorDetails {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        {/* Appointment Routes */}
        <Stack.Screen name="Appointment_Booking">
          {props => (
            <AppointmentBooking
              {...props}
              setStatusBarColor={setStatusBarColor}
            />
          )}
        </Stack.Screen>

        {/* Profile Routes */}
        <Stack.Screen name="My_Account">
          {props => (
            <Account {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Privacy_Policy">
          {props => (
            <PrivacyPolicy {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="App_Usage">
          {props => (
            <AppUsage {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="My_Appointments">
          {props => (
            <MyAppointments {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
