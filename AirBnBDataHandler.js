/**
 * AirBnBDataHandler module.
 * Provides functions to load and process Airbnb listings data.
 * Assumes CSV headers: id, price, bedrooms, review_scores_rating, host_id, etc.
 * @module AirBnBDataHandler
 */

import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

/**
 * Parses CSV data into an array of objects using csv-parse.
 * This robust parser correctly handles quoted fields and commas within fields.
 *
 * @param {string} csvData - The CSV data as a string.
 * @returns {Array<Object>} - Array of objects representing each row.
 */
function parseCSV(csvData) {
  return parse(csvData, {
    columns: true,         // Treats the first row as header columns.
    skip_empty_lines: true // Ignores empty lines.
  });
}

/**
 * Converts an array of objects to a CSV formatted string.
 *
 * @param {Array<Object>} data - Array of objects to convert.
 * @returns {string} - CSV formatted string.
 */
function convertToCSV(data) {
  if (!data.length) return '';

  const headers = Object.keys(data[0]);
  const headerLine = headers.join(',');

  // Helper to properly quote fields if needed.
  function quoteField(field) {
    if (field == null) return '';
    const fieldStr = String(field);
    if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
      return `"${fieldStr.replace(/"/g, '""')}"`;
    }
    return fieldStr;
  }

  const rows = data.map(row =>
    headers.map(header => quoteField(row[header])).join(',')
  );

  return [headerLine, ...rows].join('\n');
}

/**
 * Creates a new AirBnBDataHandler instance.
 * This instance supports method chaining for filtering, computations, and pinning listings.
 *
 * @param {Array<Object>} listings - Array of listing objects.
 * @returns {Object} - The handler instance.
 */
function createHandler(listings) {
  let data = listings; // current working set of listings
  let pinnedIds = [];  // array to store pinned listing ids

  return {
    /**
     * Filters listings based on given criteria.
     *
     * @param {Object} criteria - Filtering criteria.
     * @param {number[]} [criteria.priceRange] - Array [min, max] price.
     * @param {number} [criteria.rooms] - Minimum number of bedrooms.
     * @param {number} [criteria.reviewScore] - Minimum review score.
     * @returns {Object} - The handler instance for chaining.
     */
    filter(criteria) {
      data = data.filter(listing => {
        let valid = true;
        if (criteria.priceRange) {
          const price = parseFloat(listing.price);
          valid = valid && price >= criteria.priceRange[0] && price <= criteria.priceRange[1];
        }
        if (criteria.rooms) {
          const rooms = parseInt(listing.bedrooms) || 0;
          valid = valid && rooms >= criteria.rooms;
        }
        if (criteria.reviewScore) {
          const score = parseFloat(listing.review_scores_rating) || 0;
          valid = valid && score >= criteria.reviewScore;
        }
        return valid;
      });
      return this;
    },

    /**
     * Computes statistics on the current filtered listings.
     * Statistics include the count of listings and the average price per bedroom.
     *
     * @returns {Object} - The handler instance with computed stats stored.
     */
    computeStats() {
      const count = data.length;
      const totalPrice = data.reduce((sum, listing) => sum + (parseFloat(listing.price) || 0), 0);
      const totalBedrooms = data.reduce((sum, listing) => sum + (parseInt(listing.bedrooms) || 0), 0);
      const avgPricePerBedroom = totalBedrooms ? totalPrice / totalBedrooms : 0;
      this.stats = { count, avgPricePerBedroom };
      return this;
    },

    /**
     * Computes a ranking of hosts by the number of listings.
     *
     * @returns {Object} - The handler instance with host ranking stored.
     */
    computeHostRanking() {
      const ranking = data.reduce((acc, listing) => {
        const host = listing.host_id;
        acc[host] = (acc[host] || 0) + 1;
        return acc;
      }, {});
      this.hostRanking = Object.entries(ranking)
        .map(([host, count]) => ({ host, count }))
        .sort((a, b) => b.count - a.count);
      return this;
    },

    /**
     * Pins a listing so that it appears at the top of the filtered results.
     *
     * @param {string} listingId - The unique id of the listing to pin.
     * @returns {Object} - The handler instance for chaining.
     */
    pinListing(listingId) {
      if (!pinnedIds.includes(listingId)) {
        pinnedIds.push(listingId);
      }
      return this;
    },

    /**
     * Returns only the pinned listings.
     *
     * @returns {Array<Object>} - Array of pinned listing objects.
     */
    getPinnedListings() {
      return data.filter(listing => listing.id && pinnedIds.includes(listing.id));
    },

    /**
     * Exports the current filtered listings to a CSV file.
     *
     * @param {string} fileName - The name of the file to export results to.
     * @returns {Promise<void>}
     */
    exportResults(fileName) {
      // Export the filtered listings with pinned listings on top.
      const csvOutput = convertToCSV(this.getData());
      return fs.writeFile(fileName, csvOutput);
    },

    /**
     * Returns the current filtered listings with pinned listings appearing at the top.
     *
     * @returns {Array<Object>}
     */
    getData() {
      if (pinnedIds.length > 0) {
        const pinnedListings = data.filter(listing => listing.id && pinnedIds.includes(listing.id));
        const nonPinnedListings = data.filter(listing => !listing.id || !pinnedIds.includes(listing.id));
        return [...pinnedListings, ...nonPinnedListings];
      }
      return data;
    }
  };
}

/**
 * Loads CSV data from the specified file and creates a handler.
 *
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<Object>} - A promise that resolves to an AirBnBDataHandler instance.
 */
async function loadData(filePath) {
  try {
    const csvData = await fs.readFile(filePath, { encoding: 'utf8' });
    const listings = parseCSV(csvData);
    return createHandler(listings);
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}

export { loadData, createHandler, parseCSV };
export const AirBnBDataHandler = { loadData, createHandler, parseCSV };
