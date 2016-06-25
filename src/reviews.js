'use strict';

var filterBlock = document.querySelector('.reviews-filter');
var reviewBlock = document.querySelector('.reviews');
var reviewTemplate = document.getElementById('review-template');

var reviewList = document.querySelector('.reviews-list');
var elemToClone;
var ratingMaping = ['review-rating', 'review-rating-two', 'review-rating-three', 'review-rating-four', 'review-rating-five'];
var IMAGE_WIDTH = 124;
var IMAGE_HEIGHT = 124;
var MULTY_TO_GET_DAYS = 1000 * 60 * 60 * 24;
var DAYS_TO_BE_POPULAR = 4;



filterBlock.classList.add('invisible');

if ('content' in reviewTemplate) {
  elemToClone = reviewTemplate.content.children[0].cloneNode(true);
} else {
  elemToClone = reviewTemplate.children[0].cloneNode(true);
}

getReviews(function(loadedReviews) {
  var reviews = loadedReviews;
  var container = reviewList;
  setFiltrationEnabled(reviews);
  renderReviews(reviews, container);
});

function getReviews(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '//o0.github.io/assets/json/reviews.json');

  xhr.onloadstart = function() {
    reviewBlock.classList.add('reviews-list-loading');
  };
  xhr.onloadend = function() {
    reviewBlock.classList.remove('reviews-list-loading');
  };
  xhr.onload = function(evt) {
    var responseObj = evt.target;
    var response = responseObj.response;
    var reviews = JSON.parse(response);
    callback(reviews);
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
      appendReviewElement(getReviewElem(review), container);
    });
    filterBlock.classList.remove('invisible');
  } else {
    sayNothingToShow(container);
  }
}

function sayNothingToShow(placeToPut) {
  var MARGIN_FOR_TEXT = 20;
  var messageBlock = document.createElement('div');
  messageBlock.style.textAlign = 'center';
  messageBlock.style.marginBottom = MARGIN_FOR_TEXT + 'px';
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

function appendReviewElement(element, container) {
  container.appendChild(element);
}

//
function setFiltrationEnabled(unfilteredReviews) {
  var filters = document.querySelectorAll('[name="reviews"]');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
      setFilterEnabled(this.id, unfilteredReviews);
    };
  }
}
//
function setFilterEnabled(filter, initReviews) {
  var filteredReviews = getFiltredReviews(filter, initReviews);
  renderReviews(filteredReviews, reviewList);
}

function getFiltredReviews(filterName, firstReviews) {
  var reviewsToFilter = firstReviews.slice(0);
  switch (filterName) {
    case 'reviews-good':
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return (review.rating >= 3) ? true : false;
      })
        .sort(function(a, b) {
          return b.rating - a.rating;
        });
      break;
    case 'reviews-bad':
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return (review.rating < 3) ? true : false;
      })
        .sort(function(a, b) {
          return a.rating - b.rating;
        });
      break;
    case 'reviews-popular':
      reviewsToFilter = reviewsToFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
    case 'reviews-recent':
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        var daysCountAfterReviewPosting = Math.ceil((new Date() - new Date(review.date)) / MULTY_TO_GET_DAYS);
        return (daysCountAfterReviewPosting < DAYS_TO_BE_POPULAR) ? true : false;
      })
        .sort(function(a, b) {
          return (new Date(a.date) - new Date(b.date)) ? true : false;
        });
      break;
  }
  return reviewsToFilter;
}
