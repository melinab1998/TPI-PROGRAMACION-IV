import { toast } from "sonner"

export const toastHelper = {
    success: (message = "Operación exitosa") => {
        toast.success(message, {
            description: "La acción se completó correctamente",
            duration: 4000,
        })
    },

    error: (message = "Error") => {
        toast.error(message, {
            description: "Ocurrió un error inesperado",
            duration: 6000,
        })
    },

    loading: (message = "Procesando...") => {
        return toast.loading(message)
    },

    dismiss: (toastId) => {
        toast.dismiss(toastId)
    },

    promise: (promise, options) => {
        return toast.promise(promise, options)
    }
}