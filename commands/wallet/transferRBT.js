import axios from 'axios';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';
import { createLoadingSpinner, showSuccess, showError, showBanner, createTable } from '../../utils/ui.js';

export default async function transferRBT(options) {
  try {
    const did = getUserDID();
    if (!did) {
      showError('Not logged in. Please login first.');
      return;
    }

    showBanner();
    const spinner = createLoadingSpinner('Transferring RBT tokens...').start();

    const response = await axios.post(`${config.baseURL}/request_txn`, {
      did: did,
      receiver: options.to,
      rbt_amount: parseFloat(options.amount)
    }, {
      headers: getAuthHeaders()
    });

    if (response.data.status) {
      spinner.success();
      showSuccess('Transfer completed successfully!');
      
      const table = createTable(['Field', 'Value']);
      table.push(
        ['Amount', options.amount],
        ['Recipient', options.to]
      );
      console.log('\nTransaction Details:');
      console.log(table.toString());
    } else {
      spinner.error();
      showError(`Transfer failed: ${response.data.message}`);
    }
  } catch (error) {
    showError(`Error transferring RBT: ${error.response?.data?.message || error.message}`);
  }
}