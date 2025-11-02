const baseUrl = import.meta.env.VITE_BASE_SERVER_URL;

const errorMessages = {
    EMAIL_ALREADY_EXISTS: "El email ya está registrado",
    DNI_ALREADY_EXISTS: "El DNI ya está registrado",
    LICENSE_ALREADY_EXISTS: "La matrícula ya está registrada",
    PATIENT_NOT_FOUND: "Paciente no encontrado",
    DENTIST_NOT_FOUND: "Dentista no encontrado",
    USER_NOT_FOUND: "Usuario no encontrado",
    HEALTH_INSURANCE_NOT_FOUND: "Obra social no encontrada",
    HEALTH_PLAN_NOT_FOUND: "Plan de salud no encontrado",
    AVAILABILITY_NOT_FOUND: "No se encontraron horarios disponibles para este dentista",
    NO_SLOTS_PROVIDED: "Debe proporcionar al menos un horario",
    PATIENTS_NOT_FOUND: "No se encontraron pacientes registrados",
    DENTISTS_NOT_FOUND: "No se encontraron dentistas registrados",
    EMAIL_AND_PASSWORD_REQUIRED: "Email y contraseña son obligatorios",
    INVALID_EMAIL_OR_PASSWORD: "Email y/o contraseña incorrectos",
    DENTIST_NOT_ACTIVATED: "El dentista aún no está activado",
    INVALID_TOKEN: "Token inválido o paciente/dentista no encontrado",
    CURRENT_PASSWORD_INCORRECT: "La contraseña actual es incorrecta",
    PATIENT_ALREADY_HAS_TURN_TODAY: "Ya tiene un turno reservado para ese día.",
    TURN_NOT_AVAILABLE: "El horario seleccionado ya no está disponible. Elegí otro."
};

const handleResponse = async (res) => {
    let data = null;

    try {
        data = await res.json();
    } catch {}

    if (!res.ok) {
        const code = data?.message || data?.detail || `HTTP_${res.status}`;
        const message = errorMessages[code] || code || `Error ${res.status}`;

        throw { 
            message,
            status: res.status,
            details: data
        };
    }

    return data;
};

export const loginUser = (email, password, onSuccess, onError) => {
    if (!email || !password) {
        onError({ message: "Email o contraseña faltante" });
        return;
    }

    fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

/* DENTIST */
export const getAllDentists = (token, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/dentists/`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const createDentist = (payload, token, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/auth/create-dentist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const updateDentistBySuperAdmin = (id, payload, token, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    if (!id) {
        onError({ message: "ID de paciente no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/dentists/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};




export const activateDentist = (token, password, onSuccess, onError) => {
    if (!token || !password) {
        onError({ message: "Token o contraseña faltante" });
        return;
    }

    fetch(`${baseUrl}/api/auth/activate-dentist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const CreatePatientByDentist = (payload, token, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/auth/create-patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const activatePatient = (token, password, onSuccess, onError) => {
    if (!token || !password) {
        onError({ message: "Token o contraseña faltante" });
        return;
    }

    fetch(`${baseUrl}/api/auth/activate-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};


/* PATIENT */
export const registerPatient = (payload, onSuccess, onError) => {
    fetch(`${baseUrl}/api/auth/register-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const getAllPatients = (token, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/patients/`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const getPatientById = (id, token, onSuccess, onError) => {
    fetch(`${baseUrl}/api/patients/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const updatePatientByDentist = (id, payload, token, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    if (!id) {
        onError({ message: "ID de paciente no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/patients/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const UpdatePatientEmail = (id, token, data, onSuccess, onError) => {
    fetch(`${baseUrl}/api/patients/${id}/email`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const UpdatePatientPassword = (id, token, data, onSuccess, onError) => {
    fetch(`${baseUrl}/api/patients/${id}/password`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        }),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};


/* Obra social */
export const getAllHealthInsurances = (token, onSuccess, onError) => {
    fetch(`${baseUrl}/api/healthinsurances`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};


export const getHealthInsuranceById = (token, id, onSuccess, onError) => {

    fetch(`${baseUrl}/api/healthinsurances/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

/* Planes */

export const getAllHealthPlans = (token, onSuccess, onError) => {
    fetch(`${baseUrl}/api/healthplans`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const getHealthPlansByInsurance = (token, insuranceId, onSuccess, onError) => {

    fetch(`${baseUrl}/api/healthplans/byInsurance/${insuranceId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

/* Disponibilidad */
export const setAvailability = (token, dentistId, data, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/availabilities/${dentistId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};


export const getAvailability = (token, dentistId, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/availabilities/${dentistId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const toggleDentistStatus = (id, isActive, token, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    if (!id) {
        onError({ message: "ID de dentista no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/dentists/${id}/activate`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const getAvailableSlots = (token, dentistId, startDate, endDate, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/availabilities/${dentistId}/available-slots?startDate=${startDate}&endDate=${endDate}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

/* TURNOS */
export const createTurn = (token, payload, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/turns`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const getPatientTurns = (token, patientId, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/turns`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(handleResponse)
        .then((turns) => {
            const patientTurns = turns.filter(t => t.patientId === patientId);
            onSuccess(patientTurns);
        })
        .catch(onError);
};

export const cancelTurn = (token, turnId, onSuccess, onError) => {
    if (!token) {
        onError({ message: "Token no proporcionado" });
        return;
    }

    fetch(`${baseUrl}/api/turns/${turnId}/cancel`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};