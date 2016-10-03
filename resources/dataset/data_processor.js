#!/usr/bin/env node
//-----------------------
// Data processor for Algolia test
// Requires restaurants_list.json and 
// restaurants_info.csv to be in the 
// same folder as the script
// Creates a json file as a result of
// the combination of the 2, and tries 
// to send the JSON to the index if the
// AdminApiKey is set
// Author : Cosme Charlier
//-----------------------

// Name of output file 
var output_filename = 'result.json';
//var AdminApiKey = '';
var AdminApiKey = '51d5da9fbb0cf570a4924c420d68608c';
var appID = 'B7W0UDJYQZ';
var indexName = 'Place2Eat';

var fs = require('fs');
var _ = require('underscore');
var algoliasearch = require('algoliasearch');
// Parse main JSON array
var origJSON = JSON.parse(fs.readFileSync('./restaurants_list.json', 'utf8'));

//Converter Class 
var Converter = require("csvtojson").Converter;
var converter = new Converter({ "delimiter": ";" });

//end_parsed will be emitted once parsing finished 
converter.on("end_parsed", function(jsonArray) {
  console.log(jsonArray[0]);
  var jsonArray_facet = _.map(jsonArray, function(obj){
    // Floor of rating, for filtering
    obj.stars_facet = Math.floor(obj.stars_count);
    // Bayesian average for sorting
    // See http://fulmicoton.com/posts/bayesian_rating
    m = 3.5;
    C = 150;
    obj.stars_bayesian = (C*m+(obj.stars_count*obj.reviews_count))/(C+obj.reviews_count);
    return obj;
  });
  console.log(jsonArray_facet[0]);
  var combined = _.map(origJSON, function(origObj) {
    return _.extend(origObj, _.findWhere(jsonArray_facet, { objectID: origObj.objectID }));
  });
  console.log(combined[0]);
  // Write JSON object to file pretty printed
  fs.writeFileSync(output_filename, JSON.stringify(combined, null, 2), 'utf8');
  // If Admin API Key is set, send JSON to API
  if (AdminApiKey.length >= 10) {
    apiAdd(combined);
  }
});

//read from csv file 
require("fs").createReadStream("./restaurants_info.csv").pipe(converter);

function apiAdd(data) {
  var client = algoliasearch(appID, AdminApiKey);
  var index = client.initIndex(indexName);
  index.addObjects(data, function(err, content) {
    console.log(content);
  });
}
