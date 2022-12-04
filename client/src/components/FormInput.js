import React from "react";
const FormInput = ({
  labelText,
  value,
  name,
  type,
  placeholder,
  handleChange,
  disabled,
}) => {
  return (
    <div className="form-row">
      <label htmlFor="" className="form-label text-left pl-4 my-4">
        {labelText ? labelText : name}
      </label>
      <input
        onChange={handleChange}
        type={type}
        className="form-input"
        name={name}
        value={value}
        placeholder={placeholder && placeholder}
        disabled={disabled}
      />
    </div>
  );
};
export default FormInput;
