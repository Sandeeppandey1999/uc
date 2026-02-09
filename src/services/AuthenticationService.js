import axios from 'axios';
import config from '../config/config';
import { encryptData } from '../utils/encryption';

class AuthenticationServiceClass {
  constructor() {
    this.hostname = window.location.hostname;
  }

  // Storage key generators
  getStorageKey(key) {
    return `${this.hostname}-uc-${key}`;
  }

  // Token Management
  storeAuthenticationDetails(data) {
    const {
      token,
      refreshToken,
      userId,
      userName,
      fullName,
      roles,
      menus,
      applications,
      extension
    } = data;

    sessionStorage.setItem(this.getStorageKey('token'), token);
    sessionStorage.setItem(this.getStorageKey('refresh-token'), refreshToken);
    sessionStorage.setItem(this.getStorageKey('user-id'), userId);
    sessionStorage.setItem(this.getStorageKey('username'), userName);
    sessionStorage.setItem(this.getStorageKey('fullname'), fullName);
    sessionStorage.setItem(this.getStorageKey('roles'), JSON.stringify(roles || []));
    sessionStorage.setItem(this.getStorageKey('menus'), JSON.stringify(menus || []));
    sessionStorage.setItem(this.getStorageKey('applications'), JSON.stringify(applications || []));
    sessionStorage.setItem(this.getStorageKey('extension'), data.extension || '');
    sessionStorage.setItem(this.getStorageKey('authenticated'), 'true');
  }

  getAuthenticationToken() {
    return sessionStorage.getItem(this.getStorageKey('token'));
  }

  getRefreshToken() {
    return sessionStorage.getItem(this.getStorageKey('refresh-token'));
  }

  setRefreshedToken(token, refreshToken) {
    sessionStorage.setItem(this.getStorageKey('token'), token);
    sessionStorage.setItem(this.getStorageKey('refresh-token'), refreshToken);
  }

  getUserId() {
    return sessionStorage.getItem(this.getStorageKey('user-id'));
  }

  getExtension() {
    return sessionStorage.getItem(this.getStorageKey('extension')) || '';
  }

  getUserName() {
    return sessionStorage.getItem(this.getStorageKey('username'));
  }

  getFullName() {
    return sessionStorage.getItem(this.getStorageKey('fullname')) || '';
  }

  getRoles() {
    const roles = sessionStorage.getItem(this.getStorageKey('roles'));
    return roles ? JSON.parse(roles) : [];
  }

  getMenus() {
    const menus = sessionStorage.getItem(this.getStorageKey('menus'));
    return menus ? JSON.parse(menus) : [];
  }

  getApplications() {
    const apps = sessionStorage.getItem(this.getStorageKey('applications'));
    return apps ? JSON.parse(apps) : [];
  }

  // Authentication Methods
  async login(username, password) {
    const encryptedUsername = encryptData(username);
    const encryptedPassword = encryptData(password);

    const response = await axios.post(`${config.app.services}auth/login`, {
      username: encryptedUsername,
      password: encryptedPassword,
    });

    return response;
  }

  async refreshTokenRequest() {
    const response = await axios.post(
      `${config.api.services}user/refreshToken`,
      null,
      {
        headers: {
          Authorization: `Refresh-Bearer ${this.getRefreshToken()}`,
        },
      }
    );

    this.setRefreshedToken(
      response.data.data.token,
      response.data.data.refreshToken
    );

    return response;
  }

  async changePassword(data) {
    return axios.post(`${config.app.services}auth/changePassword`, data);
  }

  logout() {
    const keys = [
      'token',
      'refresh-token',
      'user-id',
      'username',
      'fullname',
      'roles',
      'menus',
      'applications',
      'extension',
      'authenticated',
    ];

    keys.forEach((key) => {
      sessionStorage.removeItem(this.getStorageKey(key));
    });
  }

  isAuthenticated() {
    const token = this.getAuthenticationToken();
    const authenticated = sessionStorage.getItem(
      this.getStorageKey('authenticated')
    );
    return !!(token && authenticated === 'true');
  }

  // Role-based access control
  hasRole(role) {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  hasAnyRole(roleArray) {
    const roles = this.getRoles();
    return roleArray.some((role) => roles.includes(role));
  }

  // User preferences
  getUserPreference(key) {
    const storageKey = `${this.hostname}-pref-${this.getUserName()}-${key}`;
    return localStorage.getItem(storageKey);
  }

  setUserPreference(key, value) {
    const storageKey = `${this.hostname}-pref-${this.getUserName()}-${key}`;
    localStorage.setItem(storageKey, value);
  }
}

const AuthenticationService = new AuthenticationServiceClass();

export default AuthenticationService;
