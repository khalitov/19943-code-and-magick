'use strict';

(function() {
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
  var lowestPositiveMark = 3;
  var inputsValid = true;
  var validWatcher = [];

  var displayType = 'none';
  var displayForNonValidElem = 'inline-block';

  username.required = true;
  submitButton.disabled = true;

  for (var i = 0; i < reviewMarks.length; i++) {
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
