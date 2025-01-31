import React from "react";
import Loader from "../customLoader/Loader";
import "../../styles/globalStyles.css";
import "./Button.css";

const Button = ({
  onPress,
  title,
  loading,
  style,
  textStyle,
  width,
  disabled,
  height,
  variant,
  color,
}) => {
  return (
    <button
      className={`custom-button ${variant || "btn-primary"} ${
        disabled ? "disabled" : ""
      }`}
      onClick={onPress}
      style={{
        ...style,
        width: width || "auto",
        height: height || "auto",
      }}
      disabled={disabled}
    >
      {loading ? (
        <Loader loading={loading} size={18} color={color} />
      ) : (
        <span style={{ ...textStyle }}>{title}</span>
      )}
    </button>
  );
};

export default Button;
