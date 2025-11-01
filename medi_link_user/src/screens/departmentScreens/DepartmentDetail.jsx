import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import DoctorCard from '../../utils/customComponents/customCards/doctorCard/DoctorCard';

const {width, height} = Dimensions.get('screen');

const DepartmentDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {department, doctors = []} = route.params || {};

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.primary);
  }, []);

  const handleDoctorPress = doctor => {
    navigation.navigate('Doctor_Details', {doctor});
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={globalStyles.container}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../assets/splashScreen/splash-logo.png')}
          title={department || 'Department'}
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
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {doctors.length > 0 ? (
            doctors.map(doc => (
              <DoctorCard
                key={doc._id}
                name={doc.fullName}
                fee={doc.consultationFee}
                iconColor={theme.colors.white}
                onPress={() => handleDoctorPress(doc)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome5
                name="user-md"
                size={width * 0.1}
                color={theme.colors.white}
              />
              <Text style={styles.emptyText}>
                No doctors available in {department}.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DepartmentDetails;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: height * 0.01,
  },
  
  scrollContainer: {
    paddingVertical: height * 0.02,
    paddingBottom: height * 0.05,
  },

  contentContainer: {
    gap: height * 0.015,
    paddingHorizontal: width * 0.014,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.2,
  },

  emptyText: {
    color: theme.colors.white,
    marginTop: height * 0.02,
    fontSize: width * 0.045,
  },
});
