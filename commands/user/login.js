import inquirer from 'inquirer';
import axios from 'axios';
import config from '../../config.js';
import { saveToken } from '../../utils/auth.js';
import { createLoadingSpinner, showSuccess, showError, showBanner } from '../../utils/ui.js';

export default async function login() {
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
      }
    ]);

    const spinner = createLoadingSpinner('Logging in to Rubix network...').start();

    const response = await axios.post(`${config.baseURL}/login`, {
      email: answers.email,
      password: answers.password
    });

    if (response.data.token) {
      if (saveToken(response.data.token, answers.email)) {
        spinner.success();
        showSuccess('Successfully logged in to Rubix network!');
      } else {
        spinner.error();
        showError('Login successful, but failed to save credentials');
      }
    } else {
      spinner.error();
      showError('Login failed');
    }
  } catch (error) {
    showError(`Error logging in: ${error.response?.data?.error || error.message}`);
  }
}