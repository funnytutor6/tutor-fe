import { useState } from "react";

/**
 * Reusable password input component with show/hide toggle
 * @param {Object} props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.useInputGroup - Whether to use input-group structure (default: false)
 * @param {string} props.iconClass - Icon class for input-group (default: "bi bi-lock")
 */
const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  useInputGroup = false,
  iconClass = "bi bi-lock",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine the input className
  const inputClassName =
    className ||
    (useInputGroup ? "form-control auth-form-control" : "form-control");

  const inputElement = (
    <input
      type={showPassword ? "text" : "password"}
      className={inputClassName}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  );

  if (useInputGroup) {
    return (
      <div className="input-group auth-input-group">
        <span className="input-group-text auth-input-group-text">
          <i className={iconClass}></i>
        </span>
        {inputElement}
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          style={{ zIndex: 1 }}
        >
          <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
        </button>
      </div>
    );
  }

  return (
    <div className="position-relative">
      {inputElement}
      <button
        type="button"
        className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
        style={{
          border: "none",
          background: "none",
          padding: "0.375rem 0.75rem",
          color: "#6c757d",
          zIndex: 10,
        }}
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
      </button>
    </div>
  );
};

export default PasswordInput;
