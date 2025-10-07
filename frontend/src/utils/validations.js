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

export const appointmentValidations = {
    appointment_date: {
        required: "La fecha es requerida",
        validate: {
            notPast: (date) => {
                if (!date) return "La fecha es requerida"
                const selected = new Date(date)
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return selected >= today || "No se pueden agendar turnos pasados"
            }
        }
    },
    appointment_time: {
        required: "La hora es requerida"
    },
    dentist_id: {
        required: "Seleccione un dentista"
    },
    patient_id: {
        required: "Seleccione un paciente",
        validate: (value) => value ? true : "Seleccione un paciente"
    },
    consultation_type: {
        required: "Seleccione el tipo de turno"
    }
};

export const patientValidations = {
    first_name: {
        required: "El nombre es requerido",
        minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
        maxLength: { value: 50, message: "No puede exceder 50 caracteres" }
    },
    last_name: {
        required: "El apellido es requerido",
        minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
        maxLength: { value: 50, message: "No puede exceder 50 caracteres" }
    },
    email: {
        required: "El email es requerido",
        validate: {
            validEmail: (email) => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return regex.test(email) || "Ingrese un email válido"
            }
        }
    },
    dni: {
        required: "El DNI es requerido",
        validate: {
            onlyNumbers: (value) => /^\d+$/.test(value) || "El DNI debe contener solo números",
            validLength: (value) => (value.length >= 7 && value.length <= 9) || "El DNI debe tener entre 7 y 9 dígitos"
        }
    },
    birth_date: {
        validate: {
            notFuture: (date) => {
                if (!date) return true
                const birth = new Date(date)
                const today = new Date()
                return birth <= today || "La fecha no puede ser futura"
            },
            notTooOld: (date) => {
                if (!date) return true
                const birth = new Date(date)
                const today = new Date()
                const min = new Date()
                min.setFullYear(today.getFullYear() - 150)
                return birth >= min || "La fecha no es válida"
            }
        }
    },
    phone_number: {
        validate: {
            validCharacters: (phone) => {
                if (!phone) return true
                const regex = /^[\d\s+\-()]+$/
                return regex.test(phone) || "El teléfono contiene caracteres inválidos"
            },
            minDigits: (phone) => {
                if (!phone) return true
                const digits = phone.replace(/\D/g, "")
                return digits.length >= 8 || "Debe tener al menos 8 dígitos"
            }
        }
    },
    city: {
        maxLength: { value: 50, message: "No puede exceder 50 caracteres" }
    },
    address: {
        maxLength: { value: 100, message: "No puede exceder 100 caracteres" }
    },
    membership_number: {
        maxLength: { value: 20, message: "No puede exceder 20 caracteres" }
    }
};

export const visitValidations = {
    treatment: {
        required: "El tratamiento realizado es obligatorio",
        minLength: { value: 3, message: "Debe tener al menos 3 caracteres" }
    },
    diagnosis: {
        required: "El diagnóstico es obligatorio",
        minLength: { value: 3, message: "Debe tener al menos 3 caracteres" }
    }
};

export const availabilityValidations = {
    timeSlot: {
        validateTimeSlot: (start, end) => {
            const timeToMinutes = (time) => {
                const [h, m] = time.split(":").map(Number);
                return h * 60 + m;
            };
            return timeToMinutes(start) < timeToMinutes(end);
        },
        errorMessages: {
            invalidTimeSlot: "La hora de fin debe ser posterior a la hora de inicio",
            overlappingSlots: "Los horarios se superponen con otro bloque"
        }
    }
};