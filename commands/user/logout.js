import chalk from 'chalk';
import { clearToken } from '../../utils/auth.js';

export default function logout() {
  if (clearToken()) {
    console.log(chalk.green('Successfully logged out'));
  } else {
    console.log(chalk.red('Error logging out'));
  }
}