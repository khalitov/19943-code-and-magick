'use strict';

var Filter = require('./filter-type');
var MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
var DAYS_TO_BE_REVIEW_RECENT = 4;
module.exports = {
  getFilteredReviews: function(filterName, initReviews) {
    var reviewsToFilter = initReviews.slice(0);
    var filteredReviews;
    var MARK_TO_BE_GOOD = 3;
    switch (filterName) {
      case Filter.GOOD:
        filteredReviews = reviewsToFilter.filter(function(review) {
          return (review.rating >= MARK_TO_BE_GOOD);
        })
          .sort(function(a, b) {
            return b.rating - a.rating;
          });
        break;
      case Filter.BAD:
        filteredReviews = reviewsToFilter.filter(function(review) {
          return (review.rating < MARK_TO_BE_GOOD);
        })
          .sort(function(a, b) {
            return a.rating - b.rating;
          });
        break;
      case Filter.POPULAR:
        filteredReviews = reviewsToFilter.sort(function(a, b) {
          return b.review_usefulness - a.review_usefulness;
        });
        break;
      case Filter.RECENT:
        filteredReviews = reviewsToFilter.filter(function(review) {
          var daysCountAfterReviewPosting = Math.ceil((new Date() - new Date(review.date)) / MILLISECONDS_IN_DAY);
          return (daysCountAfterReviewPosting < DAYS_TO_BE_REVIEW_RECENT);
        })
          .sort(function(a, b) {
            return (new Date(a.date) - new Date(b.date));
          });
        break;
      default:
        filteredReviews = initReviews;
        break;
    }
    return filteredReviews;
  }

};
