import axios from 'axios';
import inquirer from 'inquirer';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';
import { createLoadingSpinner, showSuccess, showError, showBanner } from '../../utils/ui.js';

export default async function createWallet() {
  try {
    showBanner();
    const answers = await inquirer.prompt([
      {
        type: 'number',
        name: 'port',
        message: 'Enter rubix node port number:',
        validate: (input) => !isNaN(input) || 'Please enter a valid port number'
      }
    ]);

    const spinner = createLoadingSpinner('Creating your Rubix wallet...').start();

    const response = await axios.post(`${config.baseURL}/create_wallet`, {
      port: answers.port
    }, {
      headers: getAuthHeaders()
    });

    if (response.data.did) {
      spinner.success();
      showSuccess('Wallet created successfully!');
      const table = createTable(['Field', 'Value']);
      table.push(['DID', response.data.did]);
      console.log('\nWallet Details:');
      console.log(table.toString());
    } else {
      spinner.error();
      showError('Failed to create wallet');
    }
  } catch (error) {
    showError(`Error creating wallet: ${error.response?.data?.error || error.message}`);
  }
}