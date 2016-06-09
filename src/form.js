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

  var birthDate = new Date(1987, 7, 29);
  var currentDate = new Date();
  var ExpireDate;
  var monthDiff = birthDate.getMonth() - currentDate.getMonth();
  var dayDiff = birthDate.getDate() - currentDate.getDate();
  var lastBirthdayDate = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (monthDiff < 0) {
    ExpireDate = new Date(dateIncrease());
  } else if (monthDiff > 0) {
    lastBirthdayDate.setFullYear(lastBirthdayDate.getFullYear() - 1);
    ExpireDate = new Date(dateIncrease());
  } else if (dayDiff < 0) {
    ExpireDate = new Date(dateIncrease());
  } else {
    lastBirthdayDate.setFullYear(lastBirthdayDate.getFullYear() - 1);
    ExpireDate = new Date(dateIncrease());
  }

  form.onsubmit = function() {
    var checkedMark = document.querySelector('[name="review-mark"]:checked');
    browserCookies.set('checkedMark', checkedMark.value, {
      expires: ExpireDate
    });
    browserCookies.set('username', username.value, {
      expires: ExpireDate
    });
  };

  username.value = browserCookies.get('username') || '';
  if (browserCookies.get('checkedMark')) {
    reviewMarks[browserCookies.get('checkedMark') - 1].checked = true;
    initMark = reviewMarks[browserCookies.get('checkedMark') - 1];
  } else {
    reviewMarks[2].checked = true;
  }

  function dateIncrease() {
    return 2 * currentDate - lastBirthdayDate;
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
    var falseDetector = 0;
    for (i = 0; i < remindPiecesLength; i++) {
      if (validWatcher[i]) {
        remindElems[i].style.display = displayType;
      } else {
        remindElems[i].style.display = displayForNonValidElem;
        falseDetector++;
      }
    }
    inputsValid = !falseDetector;
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
