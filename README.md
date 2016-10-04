# cosme-cse

This is a demo app.

## Installation steps
- Run `npm install` to download the dependencies
- Then run at least once `npm run dev` to create a server, and generate the .css files
- When ready, run `npm run server` to run the server

## Data initialization
In order to initialize the data, a node.js script `data_processor.js` is available in the : `resources/dataset/` subfolder.  
This script will combine the two data files `restaurants_list.json` and `restaurants_info.csv` in the same directory, add the necessary computed metrics, and merge them in a single JSON file. You can specify this output file name in the `output_filename` variable.  
Moreover, you can add an `AdminAPIkey`, an `appID` and an `indexName`, and the script will send the computed data to an [algolia.com](algolia.com) index.
