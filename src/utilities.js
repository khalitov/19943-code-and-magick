'use strict';
// for displayMessage
var messageBlock = document.createElement('div');
var NOTHING_TO_SHOW_TEXT = 'К сожалению ничего не найдено';
var NOTHING_TO_SHOW_CLASS = 'reviews-nothing-to-show';
// for cloneTeemplate
var reviewTemplate = document.getElementById('review-template');
// var elemToClone;

module.exports = {
  displayMessage: function(placeToPut) {

    messageBlock.classList.add(NOTHING_TO_SHOW_CLASS);
    messageBlock.innerHTML = NOTHING_TO_SHOW_TEXT;
    placeToPut.appendChild(messageBlock);
  },
  cloneTemplate: function() {
  if ('content' in reviewTemplate) {
    elemToClone = reviewTemplate.content.children[0].cloneNode(true);
  } else {
    elemToClone = reviewTemplate.children[0].cloneNode(true);
  }

  }
};
