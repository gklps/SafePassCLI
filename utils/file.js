import fs from 'fs';
import chalk from 'chalk';

export function validateFile(filePath, description) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`${description} file not found: ${filePath}`);
    }
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      throw new Error(`${description} path is not a file: ${filePath}`);
    }
    return true;
  } catch (error) {
    console.error(chalk.red(error.message));
    return false;
  }
}

export function validateFiles(files) {
  return Object.entries(files).every(([description, path]) => validateFile(path, description));
}