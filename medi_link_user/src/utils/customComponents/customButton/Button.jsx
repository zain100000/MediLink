import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, View} from 'react-native';
import {globalStyles} from '../../../styles/globalStyles';
import {theme} from '../../../styles/theme';

const Button = ({
  onPress,
  title,
  loading,
  style,
  textStyle,
  width,
  disabled,
  backgroundColor,
  textColor,
  icon, // 👈 new prop
  iconSpacing = 8, // optional spacing between icon and text
}) => {
  const buttonContent = () => {
    if (loading) {
      return <ActivityIndicator color={textColor} size={25} />;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {icon ? <View style={{marginRight: iconSpacing}}>{icon}</View> : null}
        <Text style={[globalStyles.buttonTextPrimary, textStyle, {color: textColor}]}>
          {title}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        globalStyles.buttonPrimary,
        style,
        {
          width: width || 'auto',
          backgroundColor: disabled ? theme.colors.gray : backgroundColor,
        },
      ]}
      activeOpacity={disabled ? 1 : 0.7}>
      {buttonContent()}
    </TouchableOpacity>
  );
};

export default Button;
