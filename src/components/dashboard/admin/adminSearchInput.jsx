import React, { useEffect, useState } from "react";

const AdminSearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  maxWidth = "500px",
  delay = 500,
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  // Keep local state in sync if parent value changes externally
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Debounce: call onChange only after user stops typing for `delay` ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onChange) {
        onChange(inputValue);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [inputValue, delay, onChange]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="mb-4">
      <div className="input-group" style={{ maxWidth }}>
        <span
          className="input-group-text"
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRight: "none",
            borderRadius: "10px 0 0 10px",
            color: "#667eea",
          }}
        >
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          style={{
            border: "1px solid #dee2e6",
            borderLeft: "none",
            borderRadius: "0 10px 10px 0",
            padding: "0.75rem 1rem",
            fontSize: "0.9rem",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#667eea";
            e.target.style.boxShadow = "0 0 0 0.2rem rgba(102, 126, 234, 0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#dee2e6";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
    </div>
  );
};

export default AdminSearchInput;
