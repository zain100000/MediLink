import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
  Text,
} from 'react-native';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getAllDoctors} from '../../redux/slices/doctorSlice';
import DepartmentCard from '../../utils/customComponents/customCards/departmentCard/DepartmentCard';
import InputField from '../../utils/customComponents/customInputField/InputField'; // Adjust the import path if needed

const {width, height} = Dimensions.get('screen');

const Appointment = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const doctors = useSelector(state => state.doctor.doctors);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getAllDoctors());
  }, [dispatch]);

  // Extract unique departments from doctors
  useEffect(() => {
    if (doctors && doctors.length) {
      const deptSet = new Set();

      doctors.forEach(doc => {
        if (doc.departments && doc.departments.length) {
          doc.departments.forEach(deptStr => {
            try {
              const parsedDepts = JSON.parse(deptStr);
              parsedDepts.forEach(d => deptSet.add(d));
            } catch (e) {
              console.warn('Failed to parse departments:', e);
            }
          });
        }
      });

      setDepartments(Array.from(deptSet));
    }
  }, [doctors]);

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.primary);
  }, []);

  // Optional: simple icon mapping by department name keyword
  const getIconName = department => {
    const lower = department.toLowerCase();
    if (lower.includes('dermatology')) return 'hand-extended-outline';
    if (lower.includes('dentistry')) return 'tooth-outline';
    if (lower.includes('psychiatry')) return 'brain';
    if (
      lower.includes('ear') ||
      lower.includes('nose') ||
      lower.includes('throat')
    )
      return 'head-outline';
    return 'clinic';
  };

  // Filter departments by search query (case insensitive)
  const filteredDepartments = departments.filter(dept =>
    dept.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={globalStyles.container}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../assets/splashScreen/splash-logo.png')}
          title="Book an appointment"
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

      <View style={[styles.searchWrapper]}>
        <InputField
          placeholder="Search departments"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={
            <FontAwesome5
              name="search"
              size={width * 0.04}
              color={theme.colors.primary}
            />
          }
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCards}>
          <View style={styles.departmentContainer}>
            {filteredDepartments.length ? (
              filteredDepartments.map(dept => (
                <DepartmentCard
                  key={dept}
                  mainTitle={dept}
                  iconName={getIconName(dept)}
                  navigationTarget="DepartmentDetails"
                  rightIcon="chevron-forward"
                  iconColor={theme.colors.white}
                  textColor={theme.colors.white}
                  onPress={() =>
                    navigation.navigate('DepartmentDetails', {department: dept})
                  }
                />
              ))
            ) : (
              <View
                style={{
                  padding: 20,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome5
                  name="exclamation-circle"
                  size={width * 0.08}
                  color={theme.colors.white}
                />
                {/* Or add a Text here like "No departments found" */}
                <Text style={{color: theme.colors.white, marginTop: 10}}>
                  No Departments found
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: height * 0.01,
  },

  scrollContainer: {
    paddingBottom: height * 0.05,
  },

  departmentContainer: {
    marginVertical: height * 0.02,
    gap: height * 0.015,
  },

  searchWrapper: {
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.015,
  },
});
