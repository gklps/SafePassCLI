import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { createSpinner } from 'nanospinner';
import Table from 'cli-table3';

export function showBanner() {
  console.clear();
  const text = figlet.textSync('SafePass', { font: 'Standard' });
  console.log(gradient.pastel.multiline(text));
  console.log(boxen('Wallet Management Made Easy', {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan'
  }));
}

export function showCommand(command, options = {}) {
  // Replace placeholders with actual values if provided
  let cmdStr = command;
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      cmdStr = cmdStr.replace(`<${key}>`, value);
    });
  }

  console.log(chalk.cyan('\nExecuting command:'), chalk.white(cmdStr));
  console.log(chalk.gray('Use the CLI directly with:'));
  console.log(chalk.yellow(cmdStr + '\n'));
}

export function createLoadingSpinner(text) {
  return createSpinner(text, {
    color: 'cyan',
    spinner: {
      interval: 80,
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    }
  });
}

export function createTable(headers) {
  return new Table({
    head: headers.map(h => chalk.cyan(h)),
    style: {
      head: [],
      border: []
    },
    chars: {
      'top': '─',
      'top-mid': '┬',
      'top-left': '┌',
      'top-right': '┐',
      'bottom': '─',
      'bottom-mid': '┴',
      'bottom-left': '└',
      'bottom-right': '┘',
      'left': '│',
      'left-mid': '├',
      'mid': '─',
      'mid-mid': '┼',
      'right': '│',
      'right-mid': '┤',
      'middle': '│'
    }
  });
}

export function showSuccess(message) {
  console.log(boxen(chalk.green(message), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green'
  }));
}

export function showError(message) {
  console.log(boxen(chalk.red(message), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'red'
  }));
}

export function showInfo(message) {
  console.log(boxen(chalk.blue(message), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue'
  }));
}