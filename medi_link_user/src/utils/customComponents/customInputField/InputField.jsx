import React, {useState} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {globalStyles} from '../../../styles/globalStyles';
import {theme} from '../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const InputField = ({
  value,
  onChangeText,
  placeholder,
  style,
  inputStyle,
  secureTextEntry,
  editable,
  dropdownOptions,
  selectedValue,
  onValueChange,
  keyboardType,
  multiline,
  leftIcon,
  rightIcon,
  onRightIconPress,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={[globalStyles.inputContainer, style]}>
      {dropdownOptions ? (
        <View style={styles.dropdownWrapper}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <DropDownPicker
            open={open}
            value={selectedValue}
            items={dropdownOptions}
            setOpen={setOpen}
            setValue={onValueChange}
            placeholder={placeholder}
            listMode="MODAL"
            modalProps={{
              animationType: 'fade',
            }}
            dropDownContainerStyle={[
              {
                backgroundColor: theme.colors.white,
                borderColor: theme.colors.primary,
              },
              inputStyle,
            ]}
            style={[
              {
                borderWidth: 2,
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.white,
                borderRadius: theme.borderRadius.medium,
                height: height * 0.06,
                paddingLeft: leftIcon ? width * 0.1 : width * 0.04,
                paddingRight: rightIcon ? width * 0.1 : width * 0.04,
              },
              inputStyle,
            ]}
            textStyle={[
              {
                fontSize: width * 0.04,
                fontFamily: theme.typography.fontFamilyRegular,
                color: theme.colors.primary,
              },
            ]}
            zIndex={5}
          />
          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={onRightIconPress}
              activeOpacity={0.7}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View
          style={[styles.inputWrapper, {borderColor: theme.colors.primary}]}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.primary}
            style={[
              globalStyles.input,
              styles.textInput,
              {
                backgroundColor: theme.colors.white,
                color: theme.colors.primary,
              },
              multiline && {height: 160},
              inputStyle,
              leftIcon && {paddingLeft: width * 0.1},
              rightIcon && {paddingRight: width * 0.1},
            ]}
            secureTextEntry={secureTextEntry}
            editable={editable}
            keyboardType={keyboardType}
            multiline={multiline}
          />
          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={onRightIconPress}
              activeOpacity={0.7}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },

  textInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyMedium,
  },

  leftIconContainer: {
    position: 'absolute',
    left: width * 0.034,
    top: height * 0.02,
    zIndex: 10,
  },

  rightIconContainer: {
    position: 'absolute',
    right: width * 0.014,
    padding: height * 0.014,
    zIndex: 10,
  },
});
