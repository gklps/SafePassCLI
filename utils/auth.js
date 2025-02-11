import fs from 'fs';
import path from 'path';

function decodeJWT(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error.message);
    return null;
  }
}

export function getStoredToken() {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const configFile = path.join(homeDir, '.rubix', 'config.json');
    if (fs.existsSync(configFile)) {
      const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      return config.token;
    }
  } catch (error) {
    console.error('Error reading token:', error.message);
  }
  return null;
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

export function saveToken(token) {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const configDir = path.join(homeDir, '.rubix');
    const configFile = path.join(configDir, 'config.json');

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configFile, JSON.stringify({ token }, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving token:', error.message);
    return false;
  }
}

export function clearToken() {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const configFile = path.join(homeDir, '.rubix', 'config.json');
    
    if (fs.existsSync(configFile)) {
      fs.unlinkSync(configFile);
    }
    return true;
  } catch (error) {
    console.error('Error clearing token:', error.message);
    return false;
  }
}