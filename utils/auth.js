import fs from 'fs';
import path from 'path';

function decodeJWT(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
    return payload;
  } catch (error) {
    return null;
  }
}

function getConfigPath() {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  return path.join(homeDir, '.rubix', 'config.json');
}

function readConfig() {
  const configFile = getConfigPath();
  if (fs.existsSync(configFile)) {
    return JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }
  return { accounts: {}, activeAccount: null };
}

function writeConfig(config) {
  const configFile = getConfigPath();
  const configDir = path.dirname(configFile);
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

export function getStoredToken() {
  const config = readConfig();
  return config.activeAccount ? config.accounts[config.activeAccount]?.token : null;
}

export function getAuthHeaders() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getUserDID() {
  const token = getStoredToken();
  if (!token) return null;
  
  const payload = decodeJWT(token);
  return payload?.sub || null;
}

export function saveToken(token, email) {
  try {
    const config = readConfig();
    const payload = decodeJWT(token);
    
    if (!payload) {
      return false;
    }

    config.accounts[email] = {
      token,
      email,
      did: payload.sub
    };
    config.activeAccount = email;

    writeConfig(config);
    return true;
  } catch (error) {
    return false;
  }
}

export function clearToken() {
  try {
    const config = readConfig();
    const activeEmail = config.activeAccount;
    
    if (activeEmail && config.accounts[activeEmail]) {
      delete config.accounts[activeEmail];
      config.activeAccount = Object.keys(config.accounts)[0] || null;
      writeConfig(config);
    }
    return true;
  } catch (error) {
    return false;
  }
}

export function switchAccount(email) {
  try {
    const config = readConfig();
    
    if (!config.accounts[email]) {
      return { success: false, message: 'Account not found' };
    }

    config.activeAccount = email;
    writeConfig(config);
    return { success: true, message: `Switched to account: ${email}` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export function listAccounts() {
  try {
    const config = readConfig();
    const accounts = Object.keys(config.accounts).map(email => ({
      email,
      did: config.accounts[email].did,
      isActive: email === config.activeAccount
    }));
    return { success: true, accounts };
  } catch (error) {
    return { success: false, message: error.message };
  }
}