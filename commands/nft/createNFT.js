import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import FormData from 'form-data';
import fs from 'fs';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';
import { validateFiles } from '../../utils/file.js';

export default async function createNFT(options) {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    // Validate files exist
    if (!validateFiles({
      'Metadata': options.metadata,
      'Artifact': options.artifact
    })) {
      return;
    }

    const spinner = ora('Creating NFT...').start();
    const formData = new FormData();
    
    formData.append('did', did);
    formData.append('metadata', fs.createReadStream(options.metadata));
    formData.append('artifact', fs.createReadStream(options.artifact));

    const headers = {
      ...formData.getHeaders(),
      ...getAuthHeaders()
    };

    const response = await axios.post(`${config.baseURL}/create_nft`, formData, { headers });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nNFT created successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
      if (response.data.nftId) {
        console.log(chalk.blue('NFT ID:'), response.data.nftId);
      }
    } else {
      console.log(chalk.red('Failed to create NFT:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error creating NFT:'), error.response?.data?.message || error.message);
  }
}