import { getUserDID } from '../../utils/auth.js';
import { showError, showInfo, showBanner, createTable } from '../../utils/ui.js';

export default function getDID() {
  showBanner();
  const did = getUserDID();
  if (did) {
    const table = createTable(['Your Wallet DID']);
    table.push([did]);
    console.log(table.toString());
    showInfo('Share this DID with others to receive RBT tokens');
  } else {
    showError('Not logged in. Please login first.');
  }
}