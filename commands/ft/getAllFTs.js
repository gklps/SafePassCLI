import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function getAllFTs() {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Fetching Fungible Tokens...').start();

    const response = await axios.get(`${config.baseURL}/get_all_ft?did=${did}`, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nFungible Tokens retrieved successfully!'));
      if (response.data.result.length === 0) {
        console.log(chalk.yellow('\nNo Fungible Tokens found'));
        return;
      }
      response.data.result.forEach(ft => {
        console.log(chalk.blue('\nFT Information:'));
        console.log(chalk.white('Creator DID:'), ft.creator_did);
        console.log(chalk.white('FT Name:'), ft.ft_name);
        console.log(chalk.white('FT Count:'), ft.ft_count);
      });
    } else {
      console.log(chalk.red('Failed to get FTs:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error getting FTs:'), error.response?.data?.message || error.message);
  }
}