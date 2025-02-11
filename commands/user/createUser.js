import inquirer from 'inquirer';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';

export default async function createUser() {
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

    const spinner = ora('Creating user...').start();

    const response = await axios.post(`${config.baseURL}/create`, {
      email: answers.email,
      password: answers.password,
      name: answers.name,
      secret_key: answers.secret_key || answers.password
    });

    spinner.stop();

    if (response.data.did) {
      console.log(chalk.green('\nUser created successfully!'));
      console.log(chalk.blue('DID:'), response.data.did);
      console.log(chalk.blue('Email:'), response.data.email);
      console.log(chalk.blue('Name:'), response.data.name);
    } else {
      console.log(chalk.red('Failed to create user'));
    }
  } catch (error) {
    console.error(chalk.red('Error creating user:'), error.response?.data?.error || error.message);
  }
}