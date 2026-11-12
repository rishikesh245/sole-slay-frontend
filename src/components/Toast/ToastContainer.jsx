import { useToast } from "../../Context/Context";
import "./ToastContainer.css";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="sole-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`sole-toast sole-toast-${toast.type || "success"}`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="toast-icon">
            {toast.type === "error" ? (
              <FaExclamationCircle />
            ) : toast.type === "info" ? (
              <FaInfoCircle />
            ) : (
              <FaCheckCircle />
            )}
          </div>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            aria-label="Close notification"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
}

