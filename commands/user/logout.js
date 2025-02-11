import { clearToken } from '../../utils/auth.js';
import { showSuccess, showError, showBanner } from '../../utils/ui.js';

export default function logout() {
  showBanner();
  if (clearToken()) {
    showSuccess('Successfully logged out from Rubix network');
  } else {
    showError('Error logging out');
  }
}