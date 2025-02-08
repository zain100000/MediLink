import React from "react";
import "../../styles/globalStyles.css";
import "./InputField.css";

const InputField = ({
  value,
  onChange,
  placeholder,
  style,
  inputStyle,
  secureTextEntry,
  editable,
  dropdownOptions,
  selectedValue,
  onValueChange,
  bgColor,
  textColor,
  width,
  label,
  type,
  fullWidth = false,
  required = false,
  icon,
}) => {
  return (
    <section id="input-field">
      <div style={{ ...style, width: width || "100%" }}>
        {dropdownOptions ? (
          <select
            className="custom-input"
            value={selectedValue}
            onChange={(e) => onValueChange(e.target.value)}
            style={{
              backgroundColor: bgColor || "var(--white)",
              color: textColor || "var(--dark)",
              width: fullWidth ? "100%" : "auto",
            }}
            required={required}
          >
            <option value="" disabled>
              {label || placeholder}
            </option>
            {dropdownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <>
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={label || placeholder}
              type={type || (secureTextEntry ? "password" : "text")}
              className="custom-input"
              required={required}
              style={{
                backgroundColor: bgColor || "var(--white)",
                color: textColor || "var(--dark)",
                ...inputStyle,
              }}
              readOnly={!editable}
            />
            {icon && <div className="input-icon">{icon}</div>}
          </>
        )}
      </div>
    </section>
  );
};

export default InputField;
