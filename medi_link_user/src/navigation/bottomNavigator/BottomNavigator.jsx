import React, {useEffect, useRef} from 'react';
import {Image, StyleSheet, Dimensions, Animated} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {theme} from '../../styles/theme';
import Home from '../../screens/dashboard/Home';
import Profile from '../../screens/profile/Profile';

const Tab = createBottomTabNavigator();
const {width, height} = Dimensions.get('screen');

const AnimatedTabIcon = ({focused, source}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: focused ? 1.2 : 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleValue]);

  return (
    <Animated.View
      style={[styles.imageContainer, {transform: [{scale: scaleValue}]}]}>
      <Image
        source={source}
        style={[
          styles.image,
          {
            tintColor: focused ? theme.colors.primary : theme.colors.gray,
          },
        ]}
      />
    </Animated.View>
  );
};

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.colors.white,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon
              focused={focused}
              source={
                focused
                  ? require('../../assets/navigatorIcons/home-filled.png')
                  : require('../../assets/navigatorIcons/home.png')
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon
              focused={focused}
              source={
                focused
                  ? require('../../assets/navigatorIcons/profile-filled.png')
                  : require('../../assets/navigatorIcons/profile.png')
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBar: {
    height: height * 0.074,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderTopWidth: 0,
  },

  tabBarLabel: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
    marginTop: height * 0.009,
  },

  imageContainer: {
    marginTop: height * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: width * 0.07,
    height: height * 0.04,
    resizeMode: 'contain',
  },
});
