import axios from 'axios';
import config from '../../config.js';
import { getAuthHeaders } from '../../utils/auth.js';
import { createLoadingSpinner, showSuccess, showError, showBanner, createTable } from '../../utils/ui.js';

export default async function getAllNFTs(options) {
  try {
    showBanner();
    const spinner = createLoadingSpinner('Fetching all NFTs...').start();

    const response = await axios.get(`${config.baseURL}/get_all_nft?did=${options.did}`, {
      headers: getAuthHeaders()
    });

    if (response.data.status) {
      spinner.success();
      
      if (response.data.result.length === 0) {
        showInfo('No NFTs found');
        return;
      }

      const table = createTable(['NFT ID', 'Value', 'Owner DID']);
      response.data.result.forEach(nft => {
        table.push([
          nft.nft,
          nft.nft_value.toString(),
          nft.owner_did
        ]);
      });

      console.log('\nNFT Collection:');
      console.log(table.toString());
    } else {
      spinner.error();
      showError(`Failed to get NFTs: ${response.data.message}`);
    }
  } catch (error) {
    showError(`Error getting NFTs: ${error.response?.data?.message || error.message}`);
  }
}