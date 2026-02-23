import axios from 'axios';
import config from '../config/config';
import { encryptData } from '../utils/encryption';

class AuthenticationServiceClass {
  constructor() {
    this.hostname = window.location.hostname;
  }

  normalizeText(value) {
    if (value === null || value === undefined) return '';
    const text = String(value).trim();
    if (!text || text.toLowerCase() === 'undefined' || text.toLowerCase() === 'null') {
      return '';
    }
    return text;
  }

  // Storage key generators
  getStorageKey(key) {
    const legacyKeyMap = {
      token: 'Token',
      'refresh-token': 'Refresh-Token',
      'user-id': 'User-Id',
      username: 'UserName',
      fullname: 'FullName',
      description: 'Description',
      'display-name': 'Display-Name',
      roles: 'Roles',
      menus: 'Menus',
      applications: 'Apps',
      extension: 'Extension',
      sip: 'SIP',
      'rlu-ip': 'RLUIp',
      'rlu-code': 'RLUCode',
      'password-complexity': 'PasswordComplexity',
      'ideal-timeout': 'Ideal-Timeout',
      authenticated: 'Authenticated',
      user: 'User',
    };

    const mapped = legacyKeyMap[key] || key;
    return `${this.hostname}-coral-X-${mapped}`;
  }

  // Token Management
  storeAuthenticationDetails(data) {
    const userName = this.normalizeText(data.userName || data.username);
    const fullName = this.normalizeText(data.fullName);
    const description = this.normalizeText(data.description);
    const displayName = description || fullName || userName;
    const roles = Array.isArray(data.roles)
      ? data.roles
      : this.normalizeText(data.roles)
        ? [data.roles]
        : [];
    const menus = data.menus || data.menu || [];
    const applications = data.applications || data.coralApplication || [];
    const extension = this.normalizeText(data.extension);
    const sipDetails = {
      extensionName: this.normalizeText(data.extensionName),
      extension,
      sipPassword: this.normalizeText(data.sipPassword),
    };

    const {
      token,
      refreshToken,
      userId,
      rluIp,
      rluCode,
      pwdComplication,
      idealTimeout
    } = data;

    sessionStorage.setItem(this.getStorageKey('token'), token);
    sessionStorage.setItem(this.getStorageKey('refresh-token'), refreshToken);
    sessionStorage.setItem(this.getStorageKey('user-id'), userId);
    sessionStorage.setItem(this.getStorageKey('user'), userName);
    sessionStorage.setItem(this.getStorageKey('username'), userName);
    sessionStorage.setItem(this.getStorageKey('fullname'), fullName);
    sessionStorage.setItem(this.getStorageKey('description'), description);
    sessionStorage.setItem(this.getStorageKey('display-name'), displayName);
    sessionStorage.setItem(this.getStorageKey('roles'), JSON.stringify(roles || []));
    sessionStorage.setItem(this.getStorageKey('menus'), JSON.stringify(menus || []));
    sessionStorage.setItem(this.getStorageKey('applications'), JSON.stringify(applications || []));
    sessionStorage.setItem(this.getStorageKey('extension'), extension);
    sessionStorage.setItem(this.getStorageKey('sip'), JSON.stringify(sipDetails));
    sessionStorage.setItem(this.getStorageKey('rlu-ip'), this.normalizeText(rluIp));
    sessionStorage.setItem(this.getStorageKey('rlu-code'), this.normalizeText(rluCode));
    sessionStorage.setItem(this.getStorageKey('password-complexity'), this.normalizeText(pwdComplication));
    sessionStorage.setItem(this.getStorageKey('ideal-timeout'), this.normalizeText(idealTimeout));
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
    const storedSIP = sessionStorage.getItem(this.getStorageKey('sip'));
    if (storedSIP) {
      try {
        const parsed = JSON.parse(storedSIP);
        if (parsed?.extension) {
          return parsed.extension;
        }
      } catch {
      }
    }

    return sessionStorage.getItem(this.getStorageKey('extension')) || '';
  }

  getUserName() {
    return this.normalizeText(sessionStorage.getItem(this.getStorageKey('username')));
  }

  getFullName() {
    return this.normalizeText(sessionStorage.getItem(this.getStorageKey('fullname')));
  }

  getDescription() {
    return this.normalizeText(sessionStorage.getItem(this.getStorageKey('description')));
  }

  getDisplayName() {
    const storedDisplayName = this.normalizeText(
      sessionStorage.getItem(this.getStorageKey('display-name'))
    );
    if (storedDisplayName) {
      return storedDisplayName;
    }

    return this.getDescription() || this.getFullName() || this.getUserName() || 'User';
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
      'user',
      'username',
      'fullname',
      'description',
      'display-name',
      'roles',
      'menus',
      'applications',
      'extension',
      'sip',
      'rlu-ip',
      'rlu-code',
      'password-complexity',
      'ideal-timeout',
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
