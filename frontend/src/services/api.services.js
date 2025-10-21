const baseUrl = import.meta.env.VITE_BASE_SERVER_URL;

const handleResponse = async (res) => {
    
    let data = null;
    
    try {
        data = await res.json(); 
    } catch {
    }

    if (!res.ok) {
        const message = data?.detail || data?.title || data?.message || `Error ${res.status}`;
        throw { 
            message,
            status: res.status,
            details: data
        };
    }

    return data;
};

/* LOGIN */

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
export const GetAllHealthInsurances = (token, onSuccess, onError) => {
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


export const GetHealthInsuranceById = (token, id, onSuccess, onError) => {
   
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

export const GetAllHealthPlans = (token, onSuccess, onError) => {
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