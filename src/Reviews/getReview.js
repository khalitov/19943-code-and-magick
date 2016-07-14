'use strict';

// for getReviewElem
var IMAGE_WIDTH = 124;
var IMAGE_HEIGHT = 124;
var IMAGE_TIMEOUT = 5000;
var RATING_MAPING = ['review-rating', 'review-rating-two', 'review-rating-three', 'review-rating-four', 'review-rating-five'];
module.exports = {
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
  }
};
