/* Acá van las validaciones personalizadas de formularios ej: 

export const validateEmail = (email) => {
	if (!email.trim()) return "El email es obligatorio.";
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	if (!regex.test(email)) return "Formato de email inválido.";
	return "";
}; 

*/
