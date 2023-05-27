'use strict';

(function() {
  var browserCookies = require('browser-cookies');
  var form = document.querySelector('.review-form');
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var username = document.getElementById('review-name');
  var userReview = document.getElementById('review-text');
  var inputs = [username, userReview];
  var formReminderName = document.querySelector('.review-fields-name');
  var formReminderReview = document.querySelector('.review-fields-text');
  var formReminderBlock = document.querySelector('.review-fields');
  var reminders = [formReminderName, formReminderReview, formReminderBlock];
  var submitButton = document.querySelector('.review-submit');
  var reviewMarks = document.querySelectorAll('[id^="review-mark"]');
  var reviewMarksLength = reviewMarks.length;
  var LOWEST_POSITIVE_MARK = 3;
  var STATUS_NON_DISPLAY = 'none';
  var STATUS_DISPLAY = 'inline-block';
  var BIRTH_DAY = 30;
  var BIRTH_MONTH = 7;
  var defaultMark = reviewMarks[2];

  function getExpireDate() {
    var currentDate = new Date();
    var NearestBirthDate = new Date(currentDate.getFullYear(), BIRTH_MONTH, BIRTH_DAY);
    if (NearestBirthDate - currentDate > 0) {
      NearestBirthDate.setFullYear(NearestBirthDate.getFullYear() - 1);
    }
    return new Date(2 * currentDate - NearestBirthDate);
  }

  form.onsubmit = function() {
    var checkedMark = document.querySelector('[name="review-mark"]:checked');
    browserCookies.set('checkedMark', checkedMark.value, {
      expires: getExpireDate()
    });
    browserCookies.set('username', username.value, {
      expires: getExpireDate()
    });
  };

  loadCookies();

  function loadCookies() {
    username.value = browserCookies.get('username') || '';
    if (browserCookies.get('checkedMark')) {
      reviewMarks[browserCookies.get('checkedMark') - 1].checked = true;
      defaultMark = reviewMarks[browserCookies.get('checkedMark') - 1];
    } else {
      defaultMark.checked = true;
    }
  }

  username.required = true;
  submitButton.disabled = true;
  processForm();
  for (var i = 0; i < reviewMarksLength; i++) {
    reviewMarks[i].onclick = processForm;
  }
  for (i = 0; i < inputs.length; i++) {
    inputs[i].oninput = processForm;
  }

  function processForm() {
    setRequire(this, userReview);
    toggleReminderDisplay(reminders, inputs);
    switchBtnDisabled(submitButton);
  }

  function setRequire(mark, requireInput) {
    mark = mark || defaultMark;
    if (mark.type === 'radio') {
      requireInput.required = mark.value < LOWEST_POSITIVE_MARK;
    }
  }

  function toggleReminderDisplay(arrOfReminders, arrOfInputsToRemind) {
    for (i = 0; i < arrOfInputsToRemind.length; i++) {
      arrOfReminders[i].style.display = arrOfInputsToRemind[i].validity.valid ? STATUS_NON_DISPLAY : STATUS_DISPLAY;
    }
    arrOfReminders[arrOfReminders.length - 1].style.display = checkInputsValidity(inputs) ? STATUS_NON_DISPLAY : STATUS_DISPLAY;
  }

  function switchBtnDisabled(btn) {
    btn.disabled = !checkInputsValidity(inputs);
  }

  function checkInputsValidity(arrOfInputs) {
    for (i = 0; i < arrOfInputs.length; i++) {
      if (!arrOfInputs[i].validity.valid) {
        return false;
      }
    }
    return true;
  }

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };
})();
