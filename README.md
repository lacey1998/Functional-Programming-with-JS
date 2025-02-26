# Functional-Programming-with-JS

## Overview

This project processes Airbnb listings data using a functional programming approach in JavaScript. It supports filtering listings based on price range, number of bedrooms, and review scores; computing statistics on the filtered data; ranking hosts by the number of listings; and exporting the results to a CSV file. In addition, the project implements method chaining and includes creative features.

## Features

- **Filtering:** Filter listings based on price range, number of bedrooms, and review scores.
- **Statistics:** Compute statistics (count and average price per bedroom) on the filtered listings.
- **Host Ranking:** Rank hosts by the number of listings.
- **Export:** Export the filtered listings to a CSV file.
- **Method Chaining:** All operations support chaining (e.g., `handler.filter(...).computeStats()`).
- **Creative Additions:**
  - **Pin Feature:** Users can pin a specific listing (using its unique `id`) so that pinned listings always appear at the top of the filtered results.
    - **Pin Listing (enter listing id):** Prompts the user to enter the id of the listing to pin.
    - **Print Pinned Listings:** Displays only the listings that have been pinned.

## Counter Examples

### Counter Example of an Impure Function

```js
let globalCounter = 0;
function impureAdd(x) {
  globalCounter += x;
  return globalCounter;
}
```
- **Explanation**: This function modifies a global variable, violating the principle of pure functions.

### Counter Example of a Broken Higher-Order Function

```js
function brokenMap(arr, callback) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    // BUG: The callback is not used; instead, the original element is pushed.
    result.push(arr[i]);
  }
  return result;
}
```
- **Explanation**: The function is intended to use the callback to transform each element but instead ignores it, thereby breaking the concept of higher-order functions.

## Tools and Process
- **Node.js** – JavaScript runtime
- **JSDoc** – Documentation generation
- **Functional Programming** – Emphasis on pure functions, higher-order functions, and method chaining.
- **ES Modules** – Used throughout the project.
- **csv-parse:** – A robust CSV parsing library that handles quoted fields and commas.
- **CLI** - A readline-based interactive command-line interface.

## How to Use
### **1️⃣ Installation**
```sh
# Clone the repository
git clone https://github.com/lacey1998/Functional-Programming-with-JS.git
cd Functional-Programming-with-JS

# Install dependencies
npm install
npm install csv-parse

#Obtain a Listings File
- You can use the listings.csv file included in this repository, or
- You can download another CSV file from the [AirBnB Get the Data page](https://insideairbnb.com/get-the-data/) (e.g., SF Dic 2024).
```


### **2️⃣ Running the Project**
```sh
node main.js listings.csv
```

### **3️⃣ Available Options**
Once you start the CLI, you will see the following options:
```
1. Filter listings
Apply filters based on price range, minimum bedrooms, and minimum review score.
2. Compute statistics
Compute the count of filtered listings and average price per bedroom.
3. Compute host ranking
Determine how many listings each host has and sort them in descending order.
4. Export results
Export your current filtered listings to a CSV file.
5. Pin Listing (enter listing id)
Pin a specific listing by its unique id so it appears at the top.
6. Print Pinned Listings
View only the listings that have been pinned.
7. Exit
==================================
```
## Creative Additions
### Pin Feature
The project now includes a **Pin Feature** that lets users pin a specific listing (using its unique id). Pinned listings always appear at the top of the filtered results. Two new CLI options have been added:

- **Pin Listing (enter listing id)**: Prompts the user to enter the id of the listing they wish to pin.
- **Print Pinned Listings**: Displays only the listings that have been pinned.
This feature enhances the user experience by allowing you to prioritize and quickly view listings of interest.

## Use of Generative AI in Development
This project was developed with the assistance of generative AI (ChatGPT, Model: GPT-4). Below are the details of how AI contributed to the project:

### 1. CSV Parsing Issue ###
- **Prompt**:
At the beginning, the CSV data was not being separated properly. When I ranked the data, some host IDs showed the description of the listing instead. I asked ChatGPT:
"When I rank the data, some host_id shows description of the listing, so how can I fix this?"
- **Response**: 
ChatGPT advised to use a robust CSV parsing library, such as csv-parse, to correctly handle quoted fields and commas within fields. Code examples were provided to integrate csv-parse into the data parsing process.
- **How It Was Used**:
I applied ChatGPT's suggestions by integrating csv-parse into the parsing function, which resulted in properly separated data and correct host ranking.

### 2. CSV Export Issue ###
- **Prompt**:
Later, I needed to export the filtered listings to a CSV file instead of JSON. I asked ChatGPT:
"Can you show me how to export the data to a CSV file?"
- **Response**: 
ChatGPT provided a helper function, convertToCSV(), that converts an array of objects into a CSV formatted string. The response included code demonstrating how to properly quote fields that contain commas, quotes, or newlines.
- **How It Was Used**:
I incorporated the provided code into the exportResults() function in the AirBnBDataHandler module. This change allowed the filtered listings to be exported as a valid CSV file.