//--------------------------
// JS for algolia demo
// AngularJS directives
// Author : Cosme Charlier
//--------------------------

app.directive("starDisplay", function() {
  return {
    restrict: "EA",
    template: "<div class='average-rating-container restaurant-stars-display'>" +
              "  <span class='rating background' class='readonly'>" +
              "    <span ng-repeat='star in stars' class='star'>" +
              "      <span class='fa fa-star empty'></span>" +
              "    </span>" +
              "  </span>" +
              "  <span class='rating foreground' class='readonly' style='width:{{filledInStarsContainerWidth}}%'>" +
              "    <span ng-repeat='star in stars' class='star filled'>" +
              "      <span class='fa fa-star'></span>" +
              "    </span>" +
              "  </span>" +
              "</div>",
    scope: {
      RatingValue: "=ngModel",
      max: "=?", //optional: default is 5
    },
    link: function(scope, elem, attrs) {
      if (scope.max == undefined) { scope.max = 5; }

      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({});
        }
        var starContainerMaxWidth = 100; //%
        scope.filledInStarsContainerWidth = scope.RatingValue / scope.max * starContainerMaxWidth;
      };
      updateStars();
      //scope.$watch("RatingValue", function(oldVal, newVal) {
      //  if (newVal || newVal == 0) { updateStars();}
      //});
    }
  };
});

app.directive("refinementList", function() {
  return {
    restrict: "EA",
    template: "<div ng-repeat='facet in helper.content.disjunctiveFacets |filter:facetName:true:name' class='categories'>" +
          "  <div class='ais-header'>{{name}}</div>" +
          "  <div class='checkbox' ng-repeat='res in arrData | orderBy:count'>" +
          "    <div ng-class='helper.isDisjunctiveRefined(facet.name, res.value) ? \"active\" : \"\"'>" +
          "      <label>" +
          "        <input type='checkbox' ng-checked='helper.isDisjunctiveRefined(facet.name, res.value)' ng-click='toggleRefine($event, facet.name, res.value)' /> {{res.value}}" +
          "        <span class='badge'>{{res.count}}</span>" +
          "      </label>" +
          "    </div>" +
          "  </div>" +
          "</div>",
    scope: {
      helper: "=",
      facetName: "@facet",
      name: "@"
    },
    controller: function($scope) {

      $scope.helper.on('result', function(content) {
        $scope.$apply(function() {
          // If result is found, turn the facets into an array for OrderBy sorting
          if($scope.helper.content!=undefined){
            var data=$scope.helper.content.disjunctiveFacets.filter(function(obj){return obj.name=$scope.facetName})[0].data;
            $scope.arrData = Object.keys(data).map(function(key, i) {
              var obj={};
              obj.value = key;
              obj.count = data[key];
              return obj;
            });
          };
        });
      });

      $scope.toggleRefine = function($event, facet, value) {
        $event.preventDefault();
        $scope.helper.toggleRefine(facet, value).search();
      };
    }
  };
});

app.directive("starRating", function() {
  return {
    restrict: "EA",
    template: "<div class='sub-title'>{{name}}</div>" +
              "<div ng-repeat='i in array(max+1) track by $index' style='margin-bottom: -6px;' class='star-rating'>" +
              "  <a class='ais-star-rating--link' href='' ng-click='numericRefine($event, facet, $index)'>" +
              "    <star-display ng-model='$index' max='max'></star-display>" +
              "  </a>" +
              "</div>",
    scope: {
      helper: "=",
      facet: "@",
      name: "@",
      max: "="
    },
    controller: function($scope) {
      $scope.array = Array;
      $scope.numericRefine = function($event, facet, value) {
        $event.preventDefault();
        $scope.helper.removeNumericRefinement(facet);
        $scope.helper.addNumericRefinement(facet, '>=', value).search();
      }
    }
  };
});

app.directive("navigPages", function() {
  return {
    restrict: "EA",
    template: "<ul class='ais-pagination' ng-if='helper.content.nbPages>1'>" +
              "  <li class='ais-pagination--item ais-pagination--item__previous' ng-if='helper.content.page!=0'>" +
              "    <a aria-label='Previous' href='#head' class='ais-pagination--link' ng-click='helper.setPage(helper.content.page-1).search();'>Show previous</a>" +
              "  </li>" +
              "  <li class='ais-pagination--item ais-pagination--item__next' ng-if='helper.content.page<helper.content.nbPages-1'>" +
              "    <a aria-label='Next' href='#head' class='ais-pagination--link' ng-click='helper.setPage(helper.content.page+1).search();'>Show more</a>" +
              "  </li>" +
              "</ul>",
    scope: {
      helper: "="
    }
  };
});

app.directive("stats", function() {
  return {
    restrict: "EA",
    template: "<div class='nb-results' ng-if='helper.content.nbHits'>" +
              "  {{helper.content.nbHits}} results found<span class='ais-stats--time'> in {{helper.content.processingTimeMS/1000}} seconds</span>" +
              "</div>",
    scope: {
      helper: "="
    }
  };
});

app.directive("hits", function() {
  return {
    restrict: "EA",
    templateUrl: "assets/templates/results.template.html",
    scope: {
      helper: "="
    }
  };
});

app.directive("searchBox", function() {
  return {
    restrict: "EA",
    template: "<div class='ais-search-box'>" +
              "  <input autocomplete='off' class='autocomplete' id='q' ng-model='q' placeholder={{placeholder}} type='text' spellcheck='false' autofocus/>" +
              "</div>",
    scope: {
      helper: "=",
      placeholder: "@"
    },
    controller: function($scope) {
      $scope.q = '';
      
      $scope.helper.on('result', function(content) {
        $scope.$apply(function() {
          $scope.helper.content = content;
        });
      });

      $scope.$watch('q', function(q) {
        $scope.helper.setQuery(q).search();
      });

      $scope.helper.search();
    }
  };
});
