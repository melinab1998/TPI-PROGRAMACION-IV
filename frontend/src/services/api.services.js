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

