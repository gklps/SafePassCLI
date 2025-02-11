import os from 'os';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const config = {
  port: 8080,
  host: process.env.RUBIX_API_HOST || getLocalIP(),
  get baseURL() {
    //return `http://${this.host}:${this.port}`;
    return `http://20.193.136.169:8080`
  }
};

export default config;