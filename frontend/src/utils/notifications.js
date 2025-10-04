import { toast } from "react-toastify";

const defaultNotificationConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
};

export const successToast = (mensaje, config = {}) =>
    toast.success(mensaje, { ...defaultNotificationConfig, ...config });

export const errorToast = (mensaje, config = {}) =>
    toast.error(mensaje, { ...defaultNotificationConfig, ...config });

export const infoToast = (mensaje, config = {}) =>
    toast.info(mensaje, { ...defaultNotificationConfig, ...config });
