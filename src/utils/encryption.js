import CryptoJS from 'crypto-js';
import config from '../config/config';

/**
 * Encrypt data using AES encryption with a random IV
 * @param {string} data - Data to encrypt
 * @param {string} secretKey - Secret key for encryption
 * @returns {string} - Base64 encoded encrypted data with IV
 */
export const encryptData = (data, secretKey = config.application.secretKey) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const ciphertext = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      iv: iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return iv.concat(ciphertext.ciphertext).toString(CryptoJS.enc.Base64);
};

/**
 * Decrypt data using AES decryption
 * @param {string} encryptedData - Base64 encoded encrypted data with IV
 * @param {string} secretKey - Secret key for decryption
 * @returns {string} - Decrypted data
 */
export const decryptData = (encryptedData, secretKey = config.application.secretKey) => {
  try {
    const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedData);
    const iv = CryptoJS.lib.WordArray.create(
      encryptedWordArray.words.slice(0, 4),
      16
    );
    const ciphertext = CryptoJS.lib.WordArray.create(
      encryptedWordArray.words.slice(4),
      encryptedWordArray.sigBytes - 16
    );
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
