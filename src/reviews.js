'use strict';

(function() {
  var utils = require('./utilities');
  var filter = require('./filter/filter');
  var getReview = require('./reviews/get-review-elem');
  var filterBlock = document.querySelector('.reviews-filter');
  var reviewTemplate = document.getElementById('review-template');
  var reviewList = document.querySelector('.reviews-list');
  var elemToClone;
  var PAGE_SIZE = 3;
  var showMoreReviewsBtn = document.querySelector('.reviews-controls-more');
  var reviews = [];
  var filteredReviews = [];
  var pageNumber = 0;

  filterBlock.classList.add('invisible');
  elemToClone = utils.cloneTemplate(reviewTemplate);


  getReview.getReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setFiltrationEnabled();
    filteredReviews = filter.getFilteredReviews('', reviews);
    utils.showHideNothingToShowBtn(filteredReviews, pageNumber, PAGE_SIZE, showMoreReviewsBtn);
    getReview.renderReviews(filteredReviews, reviewList, pageNumber, PAGE_SIZE, elemToClone, filterBlock);
  });

  showMoreReviewsBtn.addEventListener('click', function() {
    pageNumber++;
    getReview.renderReviews(filteredReviews, reviewList, pageNumber, PAGE_SIZE, elemToClone, filterBlock);
    utils.showHideNothingToShowBtn(filteredReviews, pageNumber, PAGE_SIZE, showMoreReviewsBtn);
  });

  function setFiltrationEnabled() {
    filterBlock.addEventListener('click', function(evt) {
      if (evt.target.name === 'reviews') {
        pageNumber = 0;
        setFilterEnabled(evt.target.id, reviews);
        utils.showHideNothingToShowBtn(filteredReviews, pageNumber, PAGE_SIZE, showMoreReviewsBtn);
      }
    });
  }

  function setFilterEnabled(filterName) {
    filteredReviews = filter.getFilteredReviews(filterName, reviews);
    getReview.renderReviews(filteredReviews, reviewList, pageNumber, PAGE_SIZE, elemToClone, filterBlock);
  }
})();
