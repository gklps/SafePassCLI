import chalk from 'chalk';
import { getUserDID } from '../../utils/auth.js';

export default function getDID() {
  const did = getUserDID();
  if (did) {
    console.log(chalk.green('\nYour Wallet DID:'));
    console.log(chalk.blue(did));
    console.log(chalk.yellow('\nShare this DID with others to receive RBT tokens'));
  } else {
    console.log(chalk.red('Not logged in. Please login first.'));
  }
}