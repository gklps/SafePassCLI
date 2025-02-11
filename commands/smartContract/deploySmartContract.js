import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function deploySmartContract(options) {
  try {
    const spinner = ora('Deploying Smart Contract...').start();

    const response = await axios.post(`${config.baseURL}/deploy-smart-contract`, {
      deployerAddr: options.deployer,
      smartContractToken: options.token,
      quorumType: parseInt(options.quorumType),
      rbtAmount: parseFloat(options.amount),
      comment: options.comment
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nSmart Contract deployed successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to deploy Smart Contract:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error deploying Smart Contract:'), error.response?.data?.message || error.message);
  }
}