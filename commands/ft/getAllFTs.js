import axios from 'axios';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';
import { createLoadingSpinner, showSuccess, showError, showBanner, createTable } from '../../utils/ui.js';

export default async function getAllFTs() {
  try {
    const did = getUserDID();
    if (!did) {
      showError('Not logged in. Please login first.');
      return;
    }

    showBanner();
    const spinner = createLoadingSpinner('Fetching Fungible Tokens...').start();

    const response = await axios.get(`${config.baseURL}/get_all_ft?did=${did}`, {
      headers: getAuthHeaders()
    });

    if (response.data.status) {
      spinner.success();
      
      if (response.data.result.length === 0) {
        showInfo('No Fungible Tokens found');
        return;
      }

      const table = createTable(['Creator DID', 'Token Name', 'Token Count']);
      response.data.result.forEach(ft => {
        table.push([
          ft.creator_did,
          ft.ft_name,
          ft.ft_count.toString()
        ]);
      });

      console.log('\nFungible Tokens:');
      console.log(table.toString());
    } else {
      spinner.error();
      showError(`Failed to get FTs: ${response.data.message}`);
    }
  } catch (error) {
    showError(`Error getting FTs: ${error.response?.data?.message || error.message}`);
  }
}