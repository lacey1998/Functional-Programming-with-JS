/**
 * UI module for interacting with the AirBnBDataHandler.
 * Implements a basic readline command-line interface.
 * @module UI
 */

import readline from 'readline';

/**
 * Starts the interactive UI.
 *
 * @param {Object} handler - An instance of AirBnBDataHandler.
 */
function startUI(handler) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  /**
   * Displays the main menu and processes user input.
   */
  function showMenu() {
    console.log('\nSelect an option:');
    console.log('1. Filter listings');
    console.log('2. Compute statistics');
    console.log('3. Compute host ranking');
    console.log('4. Export results');
    console.log('5. Pin Listing (enter listing id)');
    console.log('6. Print Pinned Listings');
    console.log('7. Exit'); // Exit is now at the end

    rl.question('Enter your choice: ', choice => {
      switch (choice.trim()) {
        case '1':
          promptFilter();
          break;
        case '2':
          handler.computeStats();
          console.log('Statistics:', handler.stats);
          showMenu();
          break;
        case '3':
          handler.computeHostRanking();
          console.log('Host Ranking:');
          handler.hostRanking.forEach((item, index) => {
            console.log(`${index + 1}. Host: ${item.host}, Listings: ${item.count}`);
          });
          showMenu();
          break;
        case '4':
          rl.question('Enter output file name: ', fileName => {
            handler.exportResults(fileName)
              .then(() => {
                console.log(`Results exported to ${fileName}`);
                showMenu();
              })
              .catch(err => {
                console.error('Error exporting results:', err);
                showMenu();
              });
          });
          break;
        case '5':
          rl.question('Enter the listing id to pin: ', id => {
            handler.pinListing(id.trim());
            console.log(`Listing with id ${id.trim()} has been pinned.`);
            showMenu();
          });
          break;
        case '6':
          const pinned = handler.getPinnedListings();
          if (pinned.length === 0) {
            console.log('No listings have been pinned.');
          } else {
            console.log('Pinned Listings:');
            pinned.forEach((listing, index) => {
              console.log(`${index + 1}. Listing ID: ${listing.id} | Price: ${listing.price} | Bedrooms: ${listing.bedrooms}`);
            });
          }
          showMenu();
          break;
        case '7':
          console.log('Exiting.');
          rl.close();
          break;
        default:
          console.log('Invalid choice.');
          showMenu();
      }
    });
  }

  /**
   * Prompts the user for filtering criteria.
   */
  function promptFilter() {
    rl.question('Enter price range (min,max) or leave empty: ', priceInput => {
      rl.question('Enter minimum number of rooms or leave empty: ', roomsInput => {
        rl.question('Enter minimum review score or leave empty: ', reviewInput => {
          const criteria = {};
          if (priceInput.trim() !== '') {
            const parts = priceInput.split(',').map(Number);
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              criteria.priceRange = parts;
            }
          }
          if (roomsInput.trim() !== '' && !isNaN(Number(roomsInput))) {
            criteria.rooms = Number(roomsInput);
          }
          if (reviewInput.trim() !== '' && !isNaN(Number(reviewInput))) {
            criteria.reviewScore = Number(reviewInput);
          }
          handler.filter(criteria);
          console.log(`Filter applied. ${handler.getData().length} listings match the criteria.`);
          showMenu();
        });
      });
    });
  }

  showMenu();
}

export { startUI };
