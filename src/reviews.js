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
var filteredReviews = [];
var Filter = {
  'ALL': 'reviews-all',
  'RECENT': 'reviews-recent',
  'POPULAR': 'reviews-popular',
  'GOOD': 'reviews-good',
  'BAD': 'reviews-bad'
};
var PAGE_SIZE = 3;
var pageNumber = 0;
var messageBlock = document.createElement('div');
var showMoreReviewsBtn = document.querySelector('.reviews-controls-more');
var NOTHING_TO_SHOW_TEXT = 'К сожалению ничего не найдено';
var NOTHING_TO_SHOW_CLASS = 'reviews-nothing-to-show';
// showMoreReviewsBtn.classList.remove('invisible');

showMoreReviewsBtn.addEventListener('click', function() {
  pageNumber++;
  renderReviews(filteredReviews, reviewList, pageNumber);
  showHideNothingToShowBtn();
});

filterBlock.classList.add('invisible');

if ('content' in reviewTemplate) {
  elemToClone = reviewTemplate.content.children[0].cloneNode(true);
} else {
  elemToClone = reviewTemplate.children[0].cloneNode(true);
}

getReviews(function(loadedReviews) {
  reviews = loadedReviews;
  setFiltrationEnabled();
  getFilteredReviews(Filter.ALL, reviews);
  showHideNothingToShowBtn();
  renderReviews(filteredReviews, reviewList, pageNumber);
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

function renderReviews(reviewsArr, container, page) {
  var fromElem = page * PAGE_SIZE;
  var toElem = fromElem + PAGE_SIZE;

  if (page === 0) {
    container.innerHTML = '';
  }

  if (reviewsArr.length !== 0) {
    reviewsArr.slice(fromElem, toElem).forEach(function(review) {
      container.appendChild(getReviewElem(review));
    });
    filterBlock.classList.remove('invisible');
  } else {
    var nothingToShowPresence = container.querySelector('.' + NOTHING_TO_SHOW_CLASS);
    if (!nothingToShowPresence) {
      sayNothingToShow(container);
    }
  }
}

function showHideNothingToShowBtn() {
  var numberOfAllPages = Math.floor(filteredReviews.length / PAGE_SIZE);
  console.log(pageNumber);
  console.log(numberOfAllPages);
  if (pageNumber === numberOfAllPages) {
    showMoreReviewsBtn.classList.add('invisible');
  } else {
    showMoreReviewsBtn.classList.remove('invisible');
  }
}

function sayNothingToShow(placeToPut) {
  messageBlock.classList.add(NOTHING_TO_SHOW_CLASS);
  messageBlock.innerHTML = NOTHING_TO_SHOW_TEXT;
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
  filterBlock.addEventListener('click', function(evt) {
    if(evt.target.name === 'reviews') {
      pageNumber = 0;
      setFilterEnabled(evt.target.id, reviews);
      showHideNothingToShowBtn();
    }
  });
}
//
function setFilterEnabled(filter) {
  filteredReviews = getFilteredReviews(filter, reviews);
  renderReviews(filteredReviews, reviewList, 0);
}

function getFilteredReviews(filterName, initReviews) {
  var reviewsToFilter = initReviews.slice(0);
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
    case Filter.ALL:
      filteredReviews = reviews;
      break;
  }
  return filteredReviews;
}
