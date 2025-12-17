import React from "react";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/**
 * Shows a custom confirmation toast dialog
 * @param {Object} options - Configuration options
 * @param {string} options.title - Title of the confirmation dialog
 * @param {string} options.message - Message to display
 * @param {string|React.ReactNode} options.confirmText - Text for confirm button (default: "Confirm")
 * @param {string|React.ReactNode} options.cancelText - Text for cancel button (default: "Cancel")
 * @param {string} options.confirmButtonClass - CSS class for confirm button (default: "btn-danger")
 * @param {string} options.icon - Bootstrap icon class (default: "bi-exclamation-triangle-fill")
 * @param {string} options.iconColor - Color for icon (default: "text-warning")
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
 */
export const showConfirmToast = ({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "btn-danger",
  icon = "bi-exclamation-triangle-fill",
  iconColor = "text-warning",
}) => {
  return new Promise((resolve) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            zIndex: 9999,
          }}
        >
          <div>
            <h5 style={{ margin: 0, fontWeight: "600", color: "#1e293b" }}>
              <i className={`bi ${icon} ${iconColor} me-2`}></i>
              {title}
            </h5>
            <p style={{ margin: "0.5rem 0 0 0", color: "#64748b" }}>
              {message}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
            >
              {cancelText}
            </button>
            <button
              className={`btn ${confirmButtonClass} btn-sm`}
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep it open until user interacts
        position: "top-center",
      }
    );
  });
};

/**
 * Shows a delete confirmation toast
 * @param {string} itemName - Name of the item being deleted (optional)
 * @param {string} additionalWarning - Additional warning message (optional)
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
 */
export const showDeleteConfirmToast = (itemName = "this item", additionalWarning = "") => {
  const message = additionalWarning
    ? `Are you sure you want to delete ${itemName}? ${additionalWarning}`
    : `Are you sure you want to delete ${itemName}? This action cannot be undone.`;
  
  return showConfirmToast({
    title: "Delete Confirmation",
    message: message,
    confirmText: (
      <React.Fragment>
        <i className="bi bi-trash me-1"></i>
        Delete
      </React.Fragment>
    ),
    cancelText: "Cancel",
    confirmButtonClass: "btn-danger",
    icon: "bi-exclamation-triangle-fill",
    iconColor: "text-warning",
  });
};

export default showConfirmToast;
