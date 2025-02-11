import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';
import { validateFiles } from '../../utils/file.js';
import { createLoadingSpinner, showSuccess, showError, showBanner, createTable } from '../../utils/ui.js';

export default async function createNFT(options) {
  try {
    const did = getUserDID();
    if (!did) {
      showError('Not logged in. Please login first.');
      return;
    }

    if (!validateFiles({
      'Metadata': options.metadata,
      'Artifact': options.artifact
    })) {
      return;
    }

    showBanner();
    const spinner = createLoadingSpinner('Creating NFT...').start();
    
    const formData = new FormData();
    formData.append('did', did);
    formData.append('metadata', fs.createReadStream(options.metadata));
    formData.append('artifact', fs.createReadStream(options.artifact));

    const headers = {
      ...formData.getHeaders(),
      ...getAuthHeaders()
    };

    const response = await axios.post(`${config.baseURL}/create_nft`, formData, { headers });

    if (response.data.status) {
      spinner.success();
      showSuccess('NFT created successfully!');
      
      const table = createTable(['Field', 'Value']);
      table.push(
        ['NFT ID', response.data.nftId || 'N/A'],
        ['Metadata File', options.metadata],
        ['Artifact File', options.artifact]
      );
      console.log('\nNFT Details:');
      console.log(table.toString());
    } else {
      spinner.error();
      showError(`Failed to create NFT: ${response.data.message}`);
    }
  } catch (error) {
    showError(`Error creating NFT: ${error.response?.data?.message || error.message}`);
  }
}