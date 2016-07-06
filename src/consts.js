'use strict';

module.exports = {
  Filter: {
    'ALL': 'reviews-all',
    'RECENT': 'reviews-recent',
    'POPULAR': 'reviews-popular',
    'GOOD': 'reviews-good',
    'BAD': 'reviews-bad'
  },
  MILLISECONDS_IN_DAY: 1000 * 60 * 60 * 24,
  MARK_TO_BE_GOOD: 3,
  REVIEWS_LIST: '//o0.github.io/assets/json/reviews.json',
  reviewBlock: document.querySelector('.reviews'),
  LOWEST_POSITIVE_MARK: 3,
  STATUS_NON_DISPLAY: 'none',
  STATUS_DISPLAY: 'inline-block'
};
