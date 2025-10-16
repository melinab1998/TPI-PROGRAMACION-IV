const baseUrl = import.meta.env.VITE_BASE_SERVER_URL;

const handleResponse = async (res) => {
    let data = null;
    
    try {
        data = await res.json(); // intenta parsear el JSON
    } catch {
        // si no es JSON, simplemente ignoramos
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

export const activateDentist = (token, password, onSuccess, onError) => {
    if (!token || !password) {
        onError({ message: "Token o contraseña faltante" });
        return;
    }

    fetch(`${baseUrl}/api/authentication/activate-dentist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const loginUser = (email, password, onSuccess, onError) => {
    if (!email || !password) {
        onError({ message: "Email o contraseña faltante" });
        return;
    }

    fetch(`${baseUrl}/api/authentication/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const registerPatient = (payload, onSuccess, onError) => {
    fetch(`${baseUrl}/api/authentication/register-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};

export const createDentist = async (payload, token) => {
    if (!token) throw { message: "Token no proporcionado" };

    const response = await fetch(`${baseUrl}/api/authentication/create-dentist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    
    // ✅ Asegúrate de que handleResponse se ejecute
    return handleResponse(response);
};