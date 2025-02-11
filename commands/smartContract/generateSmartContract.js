import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import FormData from 'form-data';
import fs from 'fs';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';
import { validateFiles } from '../../utils/file.js';

export default async function generateSmartContract(options) {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    // Validate files exist
    if (!validateFiles({
      'Binary code': options.binary,
      'Raw code': options.raw,
      'Schema': options.schema
    })) {
      return;
    }

    const spinner = ora('Generating Smart Contract...').start();
    const formData = new FormData();

    formData.append('did', did);
    formData.append('binaryCodePath', fs.createReadStream(options.binary));
    formData.append('rawCodePath', fs.createReadStream(options.raw));
    formData.append('schemaFilePath', fs.createReadStream(options.schema));

    const headers = {
      ...formData.getHeaders(),
      ...getAuthHeaders()
    };

    const response = await axios.post(`${config.baseURL}/generate-smart-contract`, formData, { headers });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nSmart Contract generated successfully!'));
      console.log(chalk.blue('Binary File Path:'), response.data.result.binaryFilePath);
      console.log(chalk.blue('Raw File Path:'), response.data.result.rawFilePath);
      console.log(chalk.blue('Schema File Path:'), response.data.result.schemaFilePath);
      if (response.data.result.contractId) {
        console.log(chalk.blue('Contract ID:'), response.data.result.contractId);
      }
    } else {
      console.log(chalk.red('Failed to generate Smart Contract:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error generating Smart Contract:'), error.response?.data?.message || error.message);
  }
}