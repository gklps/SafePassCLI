import inquirer from 'inquirer';
import { listAccounts, switchAccount } from '../../utils/auth.js';
import { showError, createTable, showSuccess, showBanner } from '../../utils/ui.js';

export default async function listUserAccounts() {
  showBanner();
  const result = listAccounts();
  
  if (result.success) {
    if (result.accounts.length === 0) {
      showError('No accounts found. Please login first.');
      return;
    }

    const table = createTable(['', 'Email', 'DID', 'Status']);
    
    result.accounts.forEach(account => {
      table.push([
        account.isActive ? '*' : '',
        account.email,
        account.did,
        account.isActive ? 'Active' : ''
      ]);
    });

    console.log('\nRegistered Accounts:');
    console.log(table.toString());

    // Interactive account switching
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'switch',
        message: 'Would you like to switch to a different account?',
        default: false
      },
      {
        type: 'list',
        name: 'account',
        message: 'Select an account to switch to:',
        choices: result.accounts
          .filter(acc => !acc.isActive)
          .map(acc => ({ name: acc.email, value: acc.email })),
        when: (answers) => answers.switch && result.accounts.length > 1
      }
    ]);

    if (answers.switch && answers.account) {
      const switchResult = switchAccount(answers.account);
      if (switchResult.success) {
        showSuccess(switchResult.message);
      } else {
        showError(`Failed to switch account: ${switchResult.message}`);
      }
    }
  } else {
    showError(`Failed to list accounts: ${result.message}`);
  }
}