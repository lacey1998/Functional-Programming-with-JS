#!/usr/bin/env node
import { loadData } from './AirBnBDataHandler.js';
import { startUI } from './ui.js';

/**
 * Main entry point.
 * Expects the CSV file path as the first command-line argument.
 */
if (process.argv.length < 3) {
  console.error('Usage: node index.js <path-to-csv-file>');
  process.exit(1);
}

const csvFilePath = process.argv[2];

loadData(csvFilePath)
  .then((handler) => {
    // Start the UI with the loaded data handler.
    startUI(handler);
  })
  .catch((err) => {
    console.error('Error loading data:', err);
  });
