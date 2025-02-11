import chalk from 'chalk';
import { switchAccount } from '../../utils/auth.js';

export default function switchUserAccount(email) {
  const result = switchAccount(email);
  
  if (result.success) {
    console.log(chalk.green(result.message));
  } else {
    console.log(chalk.red(`Failed to switch account: ${result.message}`));
  }
}