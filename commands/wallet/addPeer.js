import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import config from '../../config.js';
import { getAuthHeaders, getUserDID } from '../../utils/auth.js';

export default async function addPeer(options) {
  try {
    const did = getUserDID();
    if (!did) {
      console.log(chalk.red('Not logged in. Please login first.'));
      return;
    }

    const spinner = ora('Adding peer...').start();

    const response = await axios.post(`${config.baseURL}/add_peer`, {
      self_did: did,
      DID: options.peerDid,
      DIDType: parseInt(options.didType),
      PeerID: options.peerId
    }, {
      headers: getAuthHeaders()
    });

    spinner.stop();

    if (response.data.status) {
      console.log(chalk.green('\nPeer added successfully!'));
      console.log(chalk.blue('Message:'), response.data.message);
    } else {
      console.log(chalk.red('Failed to add peer:', response.data.message));
    }
  } catch (error) {
    console.error(chalk.red('Error adding peer:'), error.response?.data?.message || error.message);
  }
}