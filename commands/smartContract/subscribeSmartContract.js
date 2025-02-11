import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function subscribeSmartContract(options) {
  try {
    const spinner = ora('Subscribing to Smart Contract...').start();

    const response = await axios.post(`${config.baseURL}/subscribe-smart-contract`, {
      did: options.did,
      smartContractToken: options.token
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nSubscribed to Smart Contract successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to subscribe to Smart Contract:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error subscribing to Smart Contract:'), error.response?.data?.message || error.message);
  }
}