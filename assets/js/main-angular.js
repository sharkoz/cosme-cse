//--------------------------
// JS for algolia demo
// Main JS app
// Author : Cosme Charlier
//--------------------------


// Initial declaration of instantsearch settings
var app = angular.module('searchApp', ['ngSanitize', 'algoliasearch']);

app.controller('searchController', ['$scope', '$sce', 'algolia', function($scope, $sce, algolia) {
    var algolia = algolia.Client('B7W0UDJYQZ', '0bb14fcab9e3337a65c729e0e481ce7c');

    
    $scope.helper = algoliasearchHelper(algolia, 'Place2Eat', {
      facets: ['stars_facet'],
      disjunctiveFacets: ['food_type'],
      hitsPerPage: 3,
      maxValuesPerFacet: 10,
      getRankingInfo: true
    });
  }]);
