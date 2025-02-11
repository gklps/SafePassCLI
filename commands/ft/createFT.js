import axios from 'axios';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';
import { createLoadingSpinner, showSuccess, showError, showBanner, createTable } from '../../utils/ui.js';

export default async function createFT(options) {
  try {
    const did = getUserDID();
    if (!did) {
      showError('Not logged in. Please login first.');
      return;
    }

    showBanner();
    const spinner = createLoadingSpinner('Creating Fungible Tokens...').start();

    const response = await axios.post(`${config.baseURL}/create_ft`, {
      did: did,
      ft_name: options.name,
      ft_count: parseInt(options.count),
      token_count: parseInt(options.tokens)
    }, {
      headers: getAuthHeaders()
    });

    if (response.data.status) {
      spinner.success();
      showSuccess('Fungible Tokens created successfully!');
      
      const table = createTable(['Field', 'Value']);
      table.push(
        ['Token Name', options.name],
        ['Token Count', options.count],
        ['RBT Tokens', options.tokens]
      );
      console.log('\nToken Details:');
      console.log(table.toString());
    } else {
      spinner.error();
      showError(`Failed to create FT: ${response.data.message}`);
    }
  } catch (error) {
    showError(`Error creating FT: ${error.response?.data?.message || error.message}`);
  }
}