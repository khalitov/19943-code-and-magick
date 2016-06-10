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
  var lowestPositiveMark = 3;
  var inputsValid = true;
  var validWatcher = [];
  var initMark = reviewMarks[2];
  var displayType = 'none';
  var displayForNonValidElem = 'inline-block';
  var birthDay = 29;
  var birthMonth = 7;

  function getExpireDate() {
    var currentDate = new Date();
    var NearestBirthDate = new Date(currentDate.getFullYear(), birthMonth, birthDay);
    if (NearestBirthDate - currentDate > 0) {
      NearestBirthDate.setFullYear(NearestBirthDate.getFullYear() - 1);
    }
    return 2 * currentDate - NearestBirthDate;
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

  setCookies();

  function setCookies() {
    username.value = browserCookies.get('username') || '';
    if (browserCookies.get('checkedMark')) {
      reviewMarks[browserCookies.get('checkedMark') - 1].checked = true;
      initMark = reviewMarks[browserCookies.get('checkedMark') - 1];
    } else {
      initMark.checked = true;
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
    validate(inputs);
    toggleReminder(reminders);
    toggleBtn(submitButton);
  }

  function setRequire(mark, requireInput) {
    mark = mark || initMark;
    if (mark.type === 'radio') {
      requireInput.required = mark.value < lowestPositiveMark;
    }
  }


  function validate(inputElems) {
    for (i = 0; i < inputElems.length; i++) {
      validWatcher[i] = inputElems[i].validity.valid;
    }
  }

  function toggleReminder(remindElems) {
    var remindPiecesLength = remindElems.length - 1;
    inputsValid = true;
    for (i = 0; i < remindPiecesLength; i++) {
      if (validWatcher[i]) {
        remindElems[i].style.display = displayType;
      } else {
        remindElems[i].style.display = displayForNonValidElem;
        inputsValid = false;
      }
    }
    if (inputsValid) {
      remindElems[remindElems.length - 1].style.display = displayType;
    } else {
      remindElems[remindElems.length - 1].style.display = displayForNonValidElem;
    }
  }

  function toggleBtn(btn) {
    btn.disabled = !inputsValid;
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
