'use strict';

var filter = document.querySelector('.reviews-filter');
var reviewBlock = document.querySelector('.reviews');
var reviewTemplate = document.getElementById('review-template');
var elemToClone;
var ratingMaping = ['review-rating', 'review-rating-two', 'review-rating-three', 'review-rating-four', 'review-rating-five'];

if ('content' in reviewTemplate) {
  elemToClone = reviewTemplate.content.children[0].cloneNode(true);
} else {
  elemToClone = reviewTemplate.children[0].cloneNode(true);
}

filter.classList.add('invisible');
loadReviews();

function loadReviews() {
  window.reviews.forEach(function(review) {
    getReviewElem(review, reviewBlock);
  });
  filter.classList.remove('invisible');
}


function getReviewElem(data, container) {
  var element = elemToClone.cloneNode(true);
  var userImage = new Image(124, 124);
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
  container.appendChild(element);
}
