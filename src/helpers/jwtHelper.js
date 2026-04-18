import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeToken(token);

  // Si no se puede leer o no trae exp, lo tratamos como invalido.
  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};
