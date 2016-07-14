'use strict';
var getReviewElem = require('./getReview');
var getReviewElem = getReviewElem.getReviewElem;
module.exports = {
  Review: function(data, container) {
    this.data: data;
    this.element: getReviewElem();
    // onClick: function() {
    //
    // }
  }
//
}
