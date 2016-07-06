'use strict';

var reviewBlock = document.querySelector('.reviews');
var utils = require('../utilities');
var consts = require('../consts');
var REVIEWS_LIST = consts.REVIEWS_LIST;
var reviewBlock = consts.reviewBlock;
module.exports = {
  getReviews: function(callback) {
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
  },
  renderReviews: function(reviewsArr, container, page, pageSize, elemToClone, filterBlock) {
    var fromElem = page * pageSize;
    var toElem = fromElem + pageSize;

    if (page === 0) {
      container.innerHTML = '';
    }

    if (reviewsArr.length !== 0) {
      reviewsArr.slice(fromElem, toElem).forEach(function(review) {
        container.appendChild(utils.getReviewElem(elemToClone, review));
      });
      filterBlock.classList.remove('invisible');
    } else {
      utils.displayMessage(container);
    }
  }
};
