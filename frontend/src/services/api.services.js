const baseUrl = import.meta.env.VITE_BASE_SERVER_URL;

const handleResponse = async (res) => {
    let data;
    try {
        data = await res.json();
    } catch {
        throw { message: "Respuesta inválida del servidor" };
    }
    if (!res.ok) throw { message: data?.message || "Error en la solicitud" };
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