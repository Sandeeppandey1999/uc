import axios from 'axios';
import config from '../config/config';
import AuthenticationService from './AuthenticationService';

// Create axios instances
export const applicationAPI = axios.create({
  baseURL: config.api.services,
});

export const telemetryAPI = axios.create({
  baseURL: config.api.telemetry,
});

export const applicationApp = axios.create({
  baseURL: config.app.services,
});

export const telemetryApp = axios.create({
  baseURL: config.app.telemetry,
});

// Request interceptor
const requestHandler = (request) => {
  const token = AuthenticationService.getAuthenticationToken();
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
};

// Response interceptor
const responseHandler = (response) => {
  return response;
};

// Error handler with token refresh
const errorHandler = async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      await AuthenticationService.refreshTokenRequest();
      const token = AuthenticationService.getAuthenticationToken();
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return axios(originalRequest);
    } catch (refreshError) {
      AuthenticationService.logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }

  if (error.response?.status === 403) {
    AuthenticationService.logout();
    window.location.href = '/login';
  }

  return Promise.reject(error);
};

// Apply interceptors to all instances
const applyInterceptors = (instance) => {
  instance.interceptors.request.use(requestHandler, (error) =>
    Promise.reject(error)
  );
  instance.interceptors.response.use(responseHandler, errorHandler);
};

applyInterceptors(applicationAPI);
applyInterceptors(telemetryAPI);
applyInterceptors(applicationApp);
applyInterceptors(telemetryApp);

// Export convenience methods
export const api = {
  application: applicationAPI,
  telemetry: telemetryAPI,
  app: {
    services: applicationApp,
    telemetry: telemetryApp,
  },
};

export default api;
