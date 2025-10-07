export const contactValidations = {
    name: {
        required: "El nombre es obligatorio"
    },
    email: {
        required: "El email es obligatorio",
        pattern: {
            value: /^\S+@\S+$/i,
            message: "Email inválido"
        }
    },
    message: {
        required: "El mensaje es obligatorio",
        minLength: {
            value: 10,
            message: "El mensaje debe tener al menos 10 caracteres"
        }
    }
};

export const loginValidations = {
    email: {
        required: "El email es obligatorio",
        pattern: {
            value: /^\S+@\S+$/i,
            message: "Email inválido"
        }
    },
    password: {
        required: "La contraseña es obligatoria"
    }
};

export const forgotPasswordValidations = {
    email: {
        required: "El correo electrónico es obligatorio",
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Correo electrónico inválido"
        }
    }
};

export const resetPasswordValidations = {
    password: {
        required: "La contraseña es obligatoria",
        minLength: {
            value: 8,
            message: "Debe tener al menos 8 caracteres"
        },
        pattern: {
            value: /^(?=.*[A-Z]).+$/,
            message: "Debe contener al menos una mayúscula"
        }
    },
    confirm_password: {
        required: "Debe confirmar la contraseña"
    }
};