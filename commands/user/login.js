import inquirer from 'inquirer';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { saveToken } from '../../utils/auth.js';

export default async function login() {
  try {
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

    const spinner = ora('Logging in...').start();

    const response = await axios.post(`${config.baseURL}/login`, {
      email: answers.email,
      password: answers.password
    });

    spinner.stop();

    if (response.data.token) {
      if (saveToken(response.data.token)) {
        console.log(chalk.green('\nLogin successful!'));
        console.log(chalk.blue('Token has been saved'));
      } else {
        console.log(chalk.yellow('\nLogin successful, but failed to save token'));
        console.log(chalk.blue('Token:'), response.data.token);
      }
    } else {
      console.log(chalk.red('Login failed'));
    }
  } catch (error) {
    console.error(chalk.red('Error logging in:'), error.response?.data?.error || error.message);
  }
}