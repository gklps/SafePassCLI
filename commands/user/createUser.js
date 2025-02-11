import inquirer from 'inquirer';
import axios from 'axios';
import config from '../../config.js';
import { createLoadingSpinner, showSuccess, showError, showBanner } from '../../utils/ui.js';

export default async function createUser() {
  try {
    showBanner();

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email:',
        validate: (input) => input.includes('@') || 'Please enter a valid email'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter your password:',
        validate: (input) => input.length >= 3 || 'Password must be at least 3 characters'
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter your name:',
        validate: (input) => input.length > 0 || 'Name is required'
      },
      {
        type: 'password',
        name: 'secret_key',
        message: 'Enter secret key (optional, press enter to use password):',
      }
    ]);

    const spinner = createLoadingSpinner('Creating your Rubix account...').start();

    const response = await axios.post(`${config.baseURL}/create`, {
      email: answers.email,
      password: answers.password,
      name: answers.name,
      secret_key: answers.secret_key || answers.password
    });

    if (response.data.did) {
      spinner.success();
      showSuccess('Account created successfully!');
      console.log('\nAccount Details:');
      const table = createTable(['Field', 'Value']);
      table.push(
        ['DID', response.data.did],
        ['Email', response.data.email],
        ['Name', response.data.name]
      );
      console.log(table.toString());
    } else {
      spinner.error();
      showError('Failed to create account');
    }
  } catch (error) {
    showError(`Error creating account: ${error.response?.data?.error || error.message}`);
  }
}