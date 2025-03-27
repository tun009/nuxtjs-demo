import { ElNotification, ElMessageBox } from "element-plus";

/**
 * Hiển thị thông báo sử dụng ElNotification
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo (success, warning, info, error)
 * @param {string} title - Tiêu đề thông báo (optional)
 * @param {number} duration - Thời gian hiển thị (ms)
 */
export const notify = (message, type = "info", title = "", duration = 3000) => {
  ElNotification({
    title: title || capitalizeFirstLetter(type),
    message,
    type,
    duration,
    position: "top-right",
  });
};

/**
 * Thông báo thành công
 * @param {string} message - Nội dung thông báo
 * @param {string} title - Tiêu đề thông báo (optional)
 */
export const notifySuccess = (message, title = "Success") => {
  notify(message, "success", title);
};

/**
 * Thông báo lỗi
 * @param {string} message - Nội dung thông báo
 * @param {string} title - Tiêu đề thông báo (optional)
 */
export const notifyError = (message, title = "Error") => {
  notify(message, "error", title);
};

/**
 * Thông báo cảnh báo
 * @param {string} message - Nội dung thông báo
 * @param {string} title - Tiêu đề thông báo (optional)
 */
export const notifyWarning = (message, title = "Warning") => {
  notify(message, "warning", title);
};

/**
 * Thông báo thông tin
 * @param {string} message - Nội dung thông báo
 * @param {string} title - Tiêu đề thông báo (optional)
 */
export const notifyInfo = (message, title = "Information") => {
  notify(message, "info", title);
};

/**
 * Hiển thị thông báo xác nhận
 * @param {string} message - Nội dung hỏi
 * @param {string} title - Tiêu đề (optional)
 * @param {Object} options - Tùy chọn bổ sung
 * @returns {Promise} Promise với kết quả của xác nhận
 */
export const confirm = (message, title = "Confirm", options = {}) => {
  const defaultOptions = {
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    type: "warning",
    ...options,
  };
  return ElMessageBox.confirm(message, title, defaultOptions);
};

/**
 * Hiển thị thông báo alert
 * @param {string} message - Nội dung thông báo
 * @param {string} title - Tiêu đề (optional)
 * @param {Object} options - Tùy chọn bổ sung
 * @returns {Promise} Promise với kết quả của alert
 */
export const alert = (message, title = "Alert", options = {}) => {
  const defaultOptions = {
    confirmButtonText: "OK",
    type: "info",
    ...options,
  };

  return ElMessageBox.alert(message, title, defaultOptions);
};

/**
 * Hàm helper để viết hoa chữ cái đầu tiên của chuỗi
 */
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
