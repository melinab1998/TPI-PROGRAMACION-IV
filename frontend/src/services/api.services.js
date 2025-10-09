const baseUrl = import.meta.env.VITE_BASE_SERVER_URL;

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) {
        throw { data, message: data.message || "Error en la solicitud" };
    }
    return data;
};

export const activateDentist = (token, password, onSuccess, onError) => {
    fetch(`${baseUrl}/api/authentication/activate-dentist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
    })
        .then(handleResponse)
        .then(onSuccess)
        .catch(onError);
};