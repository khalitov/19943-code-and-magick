'use strict';
// for displayMessage
var messageBlock = document.createElement('div');
var NOTHING_TO_SHOW_TEXT = 'К сожалению ничего не найдено';
var NOTHING_TO_SHOW_CLASS = 'reviews-nothing-to-show';
// for getReviewElem
var IMAGE_WIDTH = 124;
var IMAGE_HEIGHT = 124;
var IMAGE_TIMEOUT = 5000;
var RATING_MAPING = ['review-rating', 'review-rating-two', 'review-rating-three', 'review-rating-four', 'review-rating-five'];
// for getExpireDate
var BIRTH_DAY = 29;
var BIRTH_MONTH = 7;
//for showMoreReviewsBtn

module.exports = {
  displayMessage: function(placeToPut) {
    messageBlock.classList.add(NOTHING_TO_SHOW_CLASS);
    messageBlock.innerHTML = NOTHING_TO_SHOW_TEXT;
    placeToPut.appendChild(messageBlock);
  },
  cloneTemplate: function(template) {
    var elemToClone;
    if ('content' in template) {
      elemToClone = template.content.children[0].cloneNode(true);
    } else {
      elemToClone = template.children[0].cloneNode(true);
    }
    return elemToClone;
  },
  getReviewElem: function(sample, data) {
    var element = sample.cloneNode(true);
    var userImage = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
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
    element.querySelector('.review-rating').classList.add(RATING_MAPING[data.rating - 1]);
    element.querySelector('.review-text').innerHTML = data.description;
    return element;
  },
  getExpireDate: function() {
    var currentDate = new Date();
    var NearestBirthDate = new Date(currentDate.getFullYear(), BIRTH_MONTH, BIRTH_DAY);
    if (NearestBirthDate - currentDate > 0) {
      NearestBirthDate.setFullYear(NearestBirthDate.getFullYear() - 1);
    }
    return new Date(2 * currentDate - NearestBirthDate);
  },
  showHideNothingToShowBtn: function(reviews, currentPage, pageSize, btn) {
    var numberOfAllPages = Math.floor(reviews.length / pageSize);
    if (currentPage === numberOfAllPages) {
      btn.classList.add('invisible');
    } else {
      btn.classList.remove('invisible');
    }
  }
};
