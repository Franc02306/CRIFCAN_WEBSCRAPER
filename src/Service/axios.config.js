import axios from "axios";
import Swal from 'sweetalert2';
import { getSession, signIn } from "next-auth/react";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  responseType: "json",
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json'
  }
});

// FUNCION PARA AGREGAR EL TOKEN A LAS SOLICITUDES
const addAuthToken = async (config) => {
  const session = await getSession();
  const token = session?.accessToken || localStorage.getItem('token');

  if (token) {
    console.log('Using token:', token);
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
};

// FUNCION PARA EXTRAER EL MENSAJE DE ERROR DEL BACKEND
const extractBackendErrorMessage = (error) => {
  if (error.response?.data) {
    const { data } = error.response;

    if (typeof data === 'object') {
      return Object.values(data).flat().join(' | '); // Combina mensajes en un solo string
    }

    return data;
  }

  return 'Ocurrió un error inesperado. Intente nuevamente.';
}

// FUNCION DE MANEJAR LOS ERRORES DE LA RESPUESTA


// FUNCION PARA RENOVAR EL TOKEN
const refreshToken = async () => {
  try {
    const session = await getSession();

    if (session?.refreshToken) {
      // Lógica para renovar el token usando el refresh_token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/models/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh: session.refreshToken
        })
      });

      const data = await response.json();

      if (data.access_token) {
        // Actualizamos el access_token en la sesión y en localStorage
        console.log('Token refreshed successfully');
        localStorage.setItem('token', data.access_token);

        return data.access_token;
      }
    }
  } catch (error) {
    console.error('Error al renovar el token:', error);
  }

  return null;
};

// MANEJADORES DE ERRORES CENTRALIZADO
const errorHandlers = {
  400: () => console.error('Solicitud incorrecta'),
  401: async () => {
    console.error('No autorizado, intentando renovar token...');

    // Intentar renovar el token si es posible
    const newToken = await refreshToken();

    if (!newToken) {
      const lang = window.location.pathname.split('/')[1];

      console.log(lang)
      
      // Si no se puede renovar el token, redirigir al login
      Swal.fire({
        title: 'Sesión Expirada',
        text: 'Tu sesión ha expirado, por favor inicia sesión nuevamente.',
        icon: 'warning',
        confirmButtonText: 'Iniciar sesión'
      }).then(() => {
        window.location.href = `/${lang}/login`;
      });
    }
  },
  500: () => console.error('Error del servidor, inténtelo más tarde'),
  default: () => console.error('Error inesperado')
};

// FUNCION PARA MANEJAR LOS ERRORES DE LA REPSUESTA
const handleResponseError = (error) => {
  const status = error.response?.status;
  const handler = errorHandlers[status] || errorHandlers.default;

  handler();

  return Promise.reject(error);
};

// INTERCEPTOR REQUEST 
API.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// INTERCEPTOR RESPONSE SIN CONDICIONALES
API.interceptors.response.use((response) => response, handleResponseError);

export default API;
