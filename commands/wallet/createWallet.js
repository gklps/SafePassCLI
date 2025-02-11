import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';

export default async function createWallet() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'number',
        name: 'port',
        message: 'Enter rubix node port number:',
        validate: (input) => !isNaN(input) || 'Please enter a valid port number'
      }
    ]);

    const spinner = ora('Creating wallet...').start();

    const response = await axios.post(`${config.baseURL}/create_wallet`, {
      port: answers.port
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.did) {
      console.log(chalk.green('\nWallet created successfully!'));
      console.log(chalk.blue('DID:'), response.data.did);
    } else {
      console.log(chalk.red('Failed to create wallet'));
    }
  } catch (error) {
    console.error(chalk.red('Error creating wallet:'), error.response?.data?.error || error.message);
  }
}