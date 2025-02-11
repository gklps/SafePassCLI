import chalk from 'chalk';

export function validateQuorumType(type) {
  const quorumType = parseInt(type);
  if (![1, 2].includes(quorumType)) {
    console.error(chalk.red('Invalid quorum type. Must be 1 or 2'));
    return false;
  }
  return true;
}

export function validatePositiveNumber(value, name) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    console.error(chalk.red(`Invalid ${name}. Must be a positive number`));
    return false;
  }
  return true;
}