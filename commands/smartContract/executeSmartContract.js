import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function executeSmartContract(options) {
  try {
    const spinner = ora('Executing Smart Contract...').start();

    const response = await axios.post(`${config.baseURL}/execute-smart-contract`, {
      executorAddr: options.executor,
      smartContractToken: options.token,
      quorumType: parseInt(options.quorumType),
      smartContractData: options.data,
      comment: options.comment
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nSmart Contract executed successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to execute Smart Contract:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error executing Smart Contract:'), error.response?.data?.message || error.message);
  }
}