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
  var lowestMark = 3;
  var allValid = true;
  var validWatcher = [];
  var eventForTextInputs = 'input';
  var eventForMarks = 'click';
  var typeForMarks = 'radio';

  var displayForValidElem = 'none';
  var displayForNonValidElem = 'inline-block';

  username.required = true;
  submitButton.disabled = true;
  hangEvent(reviewMarks, eventForMarks);
  hangEvent(inputs, eventForTextInputs);

  function hangEvent(elem, event) {
    for (var i = 0; i < elem.length; i++) {
      elem[i].addEventListener(event, function() {
        setRequire(this, userReview);
        checkValidity(inputs);
        toggleReminder(reminders);
        toggleBtn(submitButton);
      });
    }
  }

  function setRequire(mark, requireInput) {
    if (mark.type === typeForMarks) {
      requireInput.required = (mark.value < lowestMark) ? true : false;
    }
  }


  function checkValidity(inputElems) {
    for (var i = 0; i < inputElems.length; i++) {
      validWatcher[i] = inputElems[i].validity.valid ? true : false;
    }
  }

  function toggleReminder(remindElems) {
    var remindPiecesLength = remindElems.length - 1;
    var falseDetector = 0;
    for (var i = 0; i < remindPiecesLength; i++) {
      if (validWatcher[i]) {
        remindElems[i].style.display = displayForValidElem;
      } else {
        remindElems[i].style.display = displayForNonValidElem;
        falseDetector++;
      }
    }
    allValid = falseDetector ? false : true;
    if (allValid) {
      remindElems[remindElems.length - 1].style.display = displayForValidElem;
    } else {
      remindElems[remindElems.length - 1].style.display = displayForNonValidElem;
    }
  }

  function toggleBtn(btn) {
    btn.disabled = allValid ? false : true;
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
