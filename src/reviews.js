'use strict';

var filterBlock = document.querySelector('.reviews-filter');
var reviewBlock = document.querySelector('.reviews');
var reviewTemplate = document.getElementById('review-template');

var reviewList = document.querySelector('.reviews-list');
var elemToClone;
var ratingMaping = ['review-rating', 'review-rating-two', 'review-rating-three', 'review-rating-four', 'review-rating-five'];
var IMAGE_WIDTH = 124;
var IMAGE_HEIGHT = 124;
var MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
var DAYS_TO_BE_REVIEW_RECENT = 4;
var REVIEWS_LIST = '//o0.github.io/assets/json/reviews.json';
var reviews = [];

var Filter = {
  'ALL': 'all',
  'RECENT': 'reviews-recent',
  'POPULAR': 'reviews-popular',
  'GOOD': 'reviews-good',
  'BAD': 'reviews-bad'
};



filterBlock.classList.add('invisible');

if ('content' in reviewTemplate) {
  elemToClone = reviewTemplate.content.children[0].cloneNode(true);
} else {
  elemToClone = reviewTemplate.children[0].cloneNode(true);
}

getReviews(function(loadedReviews) {
  reviews = loadedReviews;
  setFiltrationEnabled();
  renderReviews(reviews, reviewList);
});

function getReviews(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', REVIEWS_LIST);

  xhr.onloadstart = function() {
    reviewBlock.classList.add('reviews-list-loading');
  };
  xhr.onloadend = function() {
    reviewBlock.classList.remove('reviews-list-loading');
  };
  xhr.onload = function(evt) {
    var responseObj = evt.target;
    var response = responseObj.response;
    var loadedReviews = JSON.parse(response);
    callback(loadedReviews);
  };
  xhr.onerror = function() {
    reviewBlock.classList.add('reviews-load-failure');
  };
  xhr.ontimeout = function() {
    reviewBlock.classList.add('reviews-load-failure');
  };
  xhr.send();
}

function renderReviews(reviewsArr, container) {
  container.innerHTML = '';
  if (reviewsArr.length !== 0) {
    reviewsArr.forEach(function(review) {
      container.appendChild(getReviewElem(review));
    });
    filterBlock.classList.remove('invisible');
  } else {
    sayNothingToShow(container);
  }
}

function sayNothingToShow(placeToPut) {
  var messageBlock = document.createElement('div');
  messageBlock.classList.add('reviews-nothing-to-show');
  messageBlock.innerHTML = 'К сожалению, ничего не найдено';
  placeToPut.appendChild(messageBlock);
}

function getReviewElem(data) {
  var element = elemToClone.cloneNode(true);
  var userImage = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
  var IMAGE_TIMEOUT = 5000;

  userImage.onload = function() {
    clearTimeout(imageLoadTimeout);
    element.querySelector('.review-author').src = userImage.src;
    element.querySelector('.review-author').width = userImage.width;
    element.querySelector('.review-author').height = userImage.height;
  };
  userImage.onerror = function() {
    element.querySelector('.review-author').classList.add('reviews-load-failure');
  };
  var imageLoadTimeout = setTimeout(function() {
    userImage.src = '';
    userImage.onerror();
  }, IMAGE_TIMEOUT);

  userImage.src = data.author.picture;
  element.querySelector('.review-author').alt = data.author.name;
  element.querySelector('.review-author').title = data.date;
  element.querySelector('.review-rating').classList.add(ratingMaping[data.rating - 1]);
  element.querySelector('.review-text').innerHTML = data.description;
  return element;
}

//
function setFiltrationEnabled() {
  var filters = document.querySelectorAll('[name="reviews"]');
  var filtersLength = filters.length;
  for (var i = 0; i < filtersLength; i++) {
    filters[i].onclick = function() {
      setFilterEnabled(this.id, reviews);
    };
  }
}
//
function setFilterEnabled(filter) {
  var filteredReviews = getFilteredReviews(filter, reviews);
  renderReviews(filteredReviews, reviewList);
}

function getFilteredReviews(filterName, initReviews) {
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
      filteredReviews = reviewsToFilter;
      break;
  }
  return filteredReviews;
}
