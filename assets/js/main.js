//--------------------------
// JS for algolia demo
// Author : Cosme Charlier
//--------------------------


// Initial declaration of instantsearch settings
var search = instantsearch({
  appId: 'B7W0UDJYQZ',
  apiKey: '0bb14fcab9e3337a65c729e0e481ce7c',
  indexName: 'Place2Eat',
  urlSync: false //true
});

var hitTemplate =
  '<div class="hit restaurant">' +
    '<div class="restaurant-object" style="background-image: url(\'{{image_url}}\');"></div>' +
    '<div class="restaurant-body">' +
      '<h4 class="restaurant-heading">{{name}}</h4>' +
      '<div class="restaurant-stars">{{stars_count}} {{#stars}}<span class="ais-star-rating--star{{^.}}__empty{{/.}}"></span>{{/stars}} <span class="restaurant-reviews">({{reviews_count}} reviews)</span></div>' +
      '<p class="restaurant-details">{{dining_style}} | {{area}} | {{price_range}}</p>' +
    '</div>' +
  '</div>';

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-box',
      placeholder: 'Search for Restaurants by Name, Cuisine, Location...'
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#categories',
      attributeName: 'food_type',
      limit: 10,
      templates: {
        header: 'Cuisine / FoodType'
      },
      operator: 'or',
      limit: 10,
      cssClasses: {
        list: 'nav nav-list',
        count: 'badge',
        active: 'active'
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.starRating({
      container: '#stars',
      attributeName: 'stars_facet',
      max: 5,
      labels: {
      	header: 'Rating',
        andUp: ''
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats-container',
      cssClasses: {
        body: 'nb-results'
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits-container',
      hitsPerPage: 3,
      templates: {
        item: hitTemplate
      },
      transformData: function(hit) {
        hit.stars = [];
        for (var i = 1; i <= 5; ++i) {
          hit.stars.push(i <= hit.stars_count);
        }
        return hit;
      }
    })
  );
  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination-container',
      maxPages: 0,
      // default is to scroll to 'body', here we disable this behavior
      scrollTo: false,
      showFirstLast: false,
      labels: {
        next: "Show more",
        previous: "Show previous"
      },
      cssClasses: {
        disabled: "pag_hidden",
        last: "pag_hidden"
      }
    })
  );

  search.start();