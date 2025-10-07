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
        required: "Debe confirmar la contraseña",
        validate: (value, { password }) => value === password || "Las contraseñas no coinciden"
    }
};

export const updateEmailValidations = {
    email: {
        required: "El email es obligatorio",
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Formato de email inválido"
        }
    }
};

export const updatePasswordValidations = {
    currentPassword: {
        required: "La contraseña actual es obligatoria"
    },
    newPassword: {
        required: "La nueva contraseña es obligatoria",
        minLength: {
            value: 8,
            message: "Debe tener al menos 8 caracteres"
        },
        validate: {
            hasUpperCase: value => /[A-Z]/.test(value) || "Debe contener al menos una mayúscula"
        }
    },
    confirmPassword: {
        required: "Debes confirmar la nueva contraseña",
        validate: (value, { newPassword }) => value === newPassword || "Las contraseñas no coinciden"
    }
};

export const dentistValidations = {
    first_name: {
        required: "El nombre es obligatorio",
        minLength: {
            value: 2,
            message: "Debe tener al menos 2 caracteres"
        }
    },
    last_name: {
        required: "El apellido es obligatorio",
        minLength: {
            value: 2,
            message: "Debe tener al menos 2 caracteres"
        }
    },
    email: {
        required: "El email es obligatorio",
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "El formato del email no es válido"
        }
    },
    license_number: {
        required: "La matrícula es obligatoria",
        pattern: {
            value: /^MN-\d{3,6}$/,
            message: "Formato inválido. Ej: MN-12345"
        }
    }
};