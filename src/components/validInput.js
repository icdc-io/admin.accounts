import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Icon, Input, Popup } from "semantic-ui-react";

const ValidInput = ({
  label,
  name,
  type = "text",
  initialValue,
  validFunctions,
  result,
  placeholder,
  popupContent,
}) => {
  const [value, setValue] = useState(initialValue || "");
  const [messageError, setMessageError] = useState("");
  const isPassword = type === "password" && initialValue;
  const inputValue = isPassword ? initialValue?.substring(0, 8) : value;
  const check = (firstRender) => {
    for (let i = 0; i < validFunctions.length; i++) {
      const isError = validFunctions[i](value);
      if (isError) {
        setMessageError(firstRender ? "" : isError);
        result("");
        break;
      }

      if (firstRender && !isError && i === validFunctions.length - 1) {
        setMessageError("");
        result(value);
      }
    }
  };

  const blurCheck = () => {
    check();
  };

  const onFocus = () => {
    isPassword && setValue("");
  };

  useEffect(() => {
    check(true);
  }, [value]);

  const inputClass = [];
  messageError && inputClass.push("invalid");

  return (
    <div className="general-input">
      <div className="popup-flex">
        <label htmlFor={name}>{label}</label>
        {popupContent && (
          <Popup
            trigger={<Icon name="question circle outline" />}
            content={popupContent}
            position="bottom left"
            inverted
          />
        )}
      </div>
      <Input
        type={type}
        name={name}
        autoComplete="off"
        onBlur={blurCheck}
        onFocus={onFocus}
        value={inputValue}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={messageError ? "invalid" : ""}
      />
      {messageError && <div className="valid_label">{messageError}</div>}
    </div>
  );
};

ValidInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  initialValue: PropTypes.any,
  validFunctions: PropTypes.array,
  result: PropTypes.func,
  placeholder: PropTypes.any,
  popupContent: PropTypes.node,
};

export default ValidInput;
