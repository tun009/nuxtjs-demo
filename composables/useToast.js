// Composable để hiển thị thông báo toast
export const useToast = () => {
  // Trạng thái toast
  const toasts = useState("toasts", () => []);

  // ID tăng dần cho toast
  let nextId = 0;

  // Thêm toast mới
  const addToast = (message, type, timeout = 5000) => {
    const id = nextId++;
    const toast = {
      id,
      message,
      type,
      timeout,
    };

    toasts.value.push(toast);

    // Tự động xóa toast sau timeout
    if (timeout > 0) {
      setTimeout(() => {
        removeToast(id);
      }, timeout);
    }

    return id;
  };

  // Xóa toast
  const removeToast = (id) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  // Các hàm tiện ích
  const success = (message, timeout) => addToast(message, "success", timeout);
  const error = (message, timeout) => addToast(message, "error", timeout);
  const info = (message, timeout) => addToast(message, "info", timeout);
  const warning = (message, timeout) => addToast(message, "warning", timeout);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};
