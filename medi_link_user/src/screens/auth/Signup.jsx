import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {theme} from '../../styles/theme';
import * as Animatable from 'react-native-animatable';
import {globalStyles} from '../../styles/globalStyles';
import AuthHeader from '../../utils/customComponents/customHeader/AuthHeader';
import Logo from '../../assets/splashScreen/splash-logo.png';
import InputField from '../../utils/customComponents/customInputField/InputField';
import Feather from 'react-native-vector-icons/Feather';
import MaterialDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../utils/customComponents/customButton/Button';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  validateName,
  validatePassword,
  validateEmail,
} from '../../utils/customValidations/Validations';
import Toast from 'react-native-toast-message';
import {registerPatient} from '../../redux/slices/authSlice';
import ImageUploadModal from '../../utils/customModals/ImageUploadModal';
import DateTimePicker from '@react-native-community/datetimepicker';

const {width, height} = Dimensions.get('screen');

const Signup = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [photoURL, setPhotoURL] = useState('');
  const [newImageURL, setNewImageURL] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    StatusBar.setBackgroundColor(theme.colors.tertiary);
  }, []);

  useEffect(() => {
    const hasErrors =
      emailError ||
      passwordError ||
      nameError ||
      !fullName ||
      !email ||
      !password ||
      !phone ||
      !gender ||
      !address ||
      !dob;
    setIsButtonEnabled(!hasErrors);
  }, [
    emailError,
    passwordError,
    nameError,
    fullName,
    email,
    password,
    phone,
    gender,
    address,
    dob,
  ]);

  const handleNameChange = value => {
    setFullName(value);
    setNameError(validateName(value));
  };

  const handleEmailChange = value => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = url => {
    setShowImageUploadModal(false);
    setNewImageURL(url);
    setPhotoURL(url);
  };

  const handleSignup = async () => {
    if (
      !fullName ||
      !email ||
      !password ||
      !phone ||
      !gender ||
      !address ||
      !dob
    ) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill out all required fields',
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('gender', gender);
      formData.append('address', address);
      formData.append('dob', dob);

      if (newImageURL) {
        const uriParts = newImageURL.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileType = fileName.split('.').pop();
        formData.append('profilePicture', {
          uri: newImageURL,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      const resultAction = await dispatch(registerPatient(formData));

      if (registerPatient.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: 'Signup Successful!',
          text2: 'Account Created!',
        });
        setFullName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setGender('');
        setAddress('');
        setDob('');
        setNewImageURL('');
        setTimeout(() => {
          navigation.replace('Signin');
        }, 3000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed!',
          text2: 'Please check your details',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Unexpected Error!',
        text2: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDob(formattedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[globalStyles.container, styles.primaryContainer]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.headerContainer}>
        <AuthHeader logo={Logo} title={'MediLink'} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          delay={300}
          style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.description}>
            Create an account and start booking your appointments with trusted
            doctors!
          </Text>

          <TouchableOpacity
            style={styles.imgContainer}
            activeOpacity={0.9}
            onPress={handleImagePress}>
            {newImageURL || photoURL ? (
              <Image
                source={{uri: newImageURL || photoURL}}
                style={styles.image}
              />
            ) : (
              <Image
                source={require('../../assets/placeholders/default-avatar.png')}
                style={styles.image}
              />
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <InputField
                placeholder="Full Name"
                value={fullName}
                onChangeText={handleNameChange}
                leftIcon={
                  <Feather
                    name="user"
                    size={width * 0.044}
                    color={theme.colors.primary}
                  />
                }
              />
              {nameError && (
                <Text style={globalStyles.textError}>{nameError}</Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                leftIcon={
                  <Feather
                    name="mail"
                    size={width * 0.044}
                    color={theme.colors.primary}
                  />
                }
              />
              {emailError && (
                <Text style={globalStyles.textError}>{emailError}</Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={hidePassword}
                leftIcon={
                  <Feather
                    name="lock"
                    size={width * 0.044}
                    color={theme.colors.primary}
                  />
                }
                rightIcon={
                  <Feather
                    name={hidePassword ? 'eye-off' : 'eye'}
                    size={width * 0.054}
                    color={theme.colors.primary}
                  />
                }
                onRightIconPress={() => setHidePassword(!hidePassword)}
              />
              {passwordError && (
                <Text style={globalStyles.textError}>{passwordError}</Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                leftIcon={
                  <Feather
                    name="phone"
                    size={width * 0.044}
                    color={theme.colors.primary}
                  />
                }
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <InputField
                style={styles.halfInput}
                placeholder="Gender"
                leftIcon={
                  <MaterialDesignIcons
                    name="gender-male-female-variant"
                    size={width * 0.044}
                    color={theme.colors.primary}
                  />
                }
                dropdownOptions={[
                  {label: 'Male', value: 'Male'},
                  {label: 'Female', value: 'Female'},
                ]}
                selectedValue={gender}
                onValueChange={callback => {
                  const value =
                    typeof callback === 'function'
                      ? callback(gender)
                      : callback;
                  setGender(value);
                }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <InputField
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                leftIcon={
                  <Feather
                    name="map-pin"
                    size={width * 0.044}
                    color={theme.colors.primary}
                  />
                }
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}>
                <InputField
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  value={dob}
                  editable={false}
                  leftIcon={
                    <Feather
                      name="calendar"
                      size={width * 0.044}
                      color={theme.colors.primary}
                    />
                  }
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
          </View>

          <View style={styles.btnContainer}>
            <Button
              title="SIGN UP"
              onPress={handleSignup}
              width={width * 0.95}
              loading={loading}
              disabled={!isButtonEnabled}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signin')}
              activeOpacity={0.9}>
              <Text style={styles.signupLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>

      <ImageUploadModal
        visible={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        onImageUpload={handleImageUpload}
        title="Upload Image!"
        description="Please Choose Your Profile Picture To Upload."
      />
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
  },

  headerContainer: {
    height: height * 0.2,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  formContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    paddingTop: height * 0.04,
    paddingHorizontal: width * 0.024,
    paddingBottom: height * 0.02,
  },

  title: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilySemiBold,
    textAlign: 'justify',
    marginBottom: height * 0.01,
    color: theme.colors.dark,
    left: width * 0.02,
  },

  description: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyRegular,
    textAlign: 'justify',
    marginBottom: height * 0.02,
    color: theme.colors.dark,
    left: width * 0.02,
    width: width * 0.9,
  },

  imgContainer: {
    alignSelf: 'center',
    marginBottom: height * 0.02,
  },

  image: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.4) / 2,
    resizeMode: 'cover',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: width * 0.04,
    marginBottom: height * 0.02,
  },

  inputWrapper: {
    flex: 1,
  },

  btnContainer: {
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: height * 0.05,
  },

  signupText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyRegular,
    textAlign: 'justify',
    color: theme.colors.dark,
    top: height * 0.008,
  },

  signupLink: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyBold,
    textAlign: 'justify',
    color: theme.colors.primary,
  },
});
