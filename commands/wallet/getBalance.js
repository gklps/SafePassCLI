import axios from 'axios';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';
import { createLoadingSpinner, showError, createTable, showBanner } from '../../utils/ui.js';

export default async function getBalance() {
  try {
    const did = getUserDID();
    if (!did) {
      showError('Not logged in. Please login first.');
      return;
    }

    showBanner();
    const spinner = createLoadingSpinner('Fetching your wallet balance...').start();

    const response = await axios.get(`${config.baseURL}/request_balance?did=${did}`, {
      headers: getAuthHeaders()
    });

    spinner.success();

    if (response.data.status) {
      const table = createTable(['DID', 'RBT Amount', 'Locked', 'Pinned', 'Pledged']);
      
      response.data.result.forEach(account => {
        table.push([
          account.did,
          account.rbt_amount.toString(),
          account.locked_rbt.toString(),
          account.pinned_rbt.toString(),
          account.pledged_rbt.toString()
        ]);
      });

      console.log('\nWallet Balance:');
      console.log(table.toString());
    } else {
      showError(`Failed to get balance: ${response.data.message}`);
    }
  } catch (error) {
    showError(`Error getting balance: ${error.response?.data?.message || error.message}`);
  }
}