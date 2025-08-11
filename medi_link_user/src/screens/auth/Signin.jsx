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
  TouchableOpacity,
} from 'react-native';
import {theme} from '../../styles/theme';
import * as Animatable from 'react-native-animatable';
import {globalStyles} from '../../styles/globalStyles';
import AuthHeader from '../../utils/customComponents/customHeader/AuthHeader';
import Logo from '../../assets/splashScreen/splash-logo.png';
import InputField from '../../utils/customComponents/customInputField/InputField';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../../utils/customComponents/customButton/Button';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  isValidInput,
  validatePassword,
  validateEmail,
} from '../../utils/customValidations/Validations';
import Toast from 'react-native-toast-message';
import {loginPatient} from '../../redux/slices/authSlice';

const {width, height} = Dimensions.get('screen');

const Signin = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const statusBarColor = theme.colors.tertiary;
    StatusBar.setBackgroundColor(statusBarColor);
  }, []);

  useEffect(() => {
    const hasErrors = emailError || passwordError || !email || !password;
    setIsButtonEnabled(!hasErrors);
  }, [emailError, passwordError, email, password]);

  const handleEmailChange = value => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleLogin = async () => {
    if (!isValidInput(email, password)) return;

    setLoading(true);

    try {
      const resultAction = await dispatch(loginPatient({email, password}));

      if (loginPatient.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: 'Login Successfully!',
          text2: 'User Logged In!',
        });

        setEmail('');
        setPassword('');

        setTimeout(() => {
          navigation.replace('Main');
        }, 3000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed!',
          text2: 'Invalid Credentials',
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
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.description}>
            It’s appointment time! Login and let’s connect you with the best
            doctors around!
          </Text>

          <Animatable.View
            animation="fadeInRight"
            duration={800}
            delay={500}
            style={styles.phoneContainer}>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              leftIcon={
                <Feather
                  name={'mail'}
                  size={width * 0.044}
                  color={theme.colors.primary}
                />
              }
            />
            {emailError && (
              <Text style={globalStyles.textError}>{emailError}</Text>
            )}
          </Animatable.View>

          <Animatable.View
            animation="fadeInRight"
            duration={800}
            delay={700}
            style={styles.passwordContainer}>
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={hidePassword}
              leftIcon={
                <Feather
                  name={'lock'}
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
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={900}
            style={styles.btnContainer}>
            <Button
              title="SIGN IN"
              onPress={handleLogin}
              width={width * 0.95}
              loading={loading}
              disabled={!isButtonEnabled}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={1100}
            style={styles.signupContainer}>
            <Text style={[styles.signupText]}>Didn't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              activeOpacity={0.9}>
              <Text style={[styles.signupLink]}>Sign Up</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signin;

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
