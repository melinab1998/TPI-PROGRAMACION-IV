const baseUrl = import.meta.env.VITE_BASE_SERVER_URL;

const handleResponse = async (res) => {
    console.log("🔍 handleResponse - Status:", res.status, "OK:", res.ok);
    
    // OBTENER EL TEXTO PRIMERO, luego decidir si es JSON
    const responseText = await res.text();
    console.log("🔍 Response text:", responseText);
    
    let data;
    
    try {
        // Intentar parsear como JSON solo si el texto parece JSON
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
            data = JSON.parse(responseText);
        } else {
            // Si no es JSON, usar el texto como mensaje
            data = { message: responseText };
        }
    } catch (error) {
        console.warn("⚠️ No se pudo parsear como JSON, usando texto plano");
        data = { message: responseText };
    }
    
    // ✅ SIEMPRE lanzar error si !res.ok, con la data parseada
    if (!res.ok) {
        console.log("🚨 Response not OK - Lanzando error:", data);
        throw { 
            message: data?.message || `Error ${res.status} en la solicitud`,
            status: res.status,
            data: data
        };
    }
    
    console.log("✅ Response OK - Retornando data:", data);
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

    return fetch(`${baseUrl}/api/authentication/create-dentist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    }).then(handleResponse);
};