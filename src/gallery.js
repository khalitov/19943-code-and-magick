'use strict';

var gallery = document.querySelector('.overlay-gallery');
var loadedPics = [];
var pics = document.querySelectorAll('.photogallery-image > img');
var picTotalNumber = gallery.querySelector('.preview-number-total');
var previewContainer = gallery.querySelector('.overlay-gallery-preview');
var pictureCurrentNumber = gallery.querySelector('.preview-number-current');
var currentPicNumber = 1;
var controlLeft = document.querySelector('.overlay-gallery-control-left');
var controlRight = document.querySelector('.overlay-gallery-control-right');
var controlClose = document.querySelector('.overlay-gallery-close');
var photogallery = document.querySelector('.photogallery');
var KEY_CODE = {
  ESC: 27,
  LEFT: 37,
  RIGHT: 39
};


getPicDescr(pics);
picTotalNumber.innerHTML = loadedPics.length;
photogallery.addEventListener('click', function(evt) {
  evt.preventDefault();
  if (evt.target.src) {
    for (var i = 0; i < loadedPics.length; i++) {
      if (evt.target.src === loadedPics[i].src) {
        currentPicNumber = i + 1;
      }
    }
    changeCountNumbers(currentPicNumber);
    showGallery(currentPicNumber);
  }
});

function getPicDescr(data) {
  loadedPics = data;
}

function showGallery(picNum) {
  gallery.classList.remove('invisible');
  showPic(picNum);
  window.addEventListener('keydown', _onDocumentKeyDown);
  controlRight.addEventListener('click', _onControlRightClick);
  controlLeft.addEventListener('click', _onControlLeftClick);
  controlClose.addEventListener('click', _onCloseClick);

}

function showPic(picNum) {
  var preview = new Image(600);
  preview.src = loadedPics[picNum - 1].src;
  previewContainer.appendChild(preview);
}

function changeCountNumbers(picNumber) {
  currentPicNumber = picNumber || currentPicNumber;
  pictureCurrentNumber.innerHTML = currentPicNumber;
}

function togglePics(direction) {
  var prevPicPreview = document.querySelector('.overlay-gallery img');
  previewContainer.removeChild(prevPicPreview);
  switch (direction) {
    case 'next':
      currentPicNumber++;
      break;
    case 'prev':
      currentPicNumber--;
      break;
  }
  switch (currentPicNumber) {
    case 0:
      currentPicNumber = loadedPics.length;
      break;
    case (loadedPics.length + 1):
      currentPicNumber = 1;
      break;
  }
  changeCountNumbers();
  showPic(currentPicNumber);
}


//
function _onDocumentKeyDown(evt) {
  switch (evt.keyCode) {
    case KEY_CODE.ESC:
      hideGallery();
      break;
    case KEY_CODE.RIGHT:
      togglePics('next');
      break;
    case KEY_CODE.LEFT:
      togglePics('prev');
      break;
  }
}

function _onControlRightClick() {
  togglePics('next');
}

function _onControlLeftClick() {
  togglePics('prev');
}

function _onCloseClick() {
  hideGallery();
}

function hideGallery() {
  gallery.classList.add('invisible');
  previewContainer.removeChild(previewContainer.querySelector('img'));

  window.removeEventListener('keydown', _onDocumentKeyDown);
  controlRight.removeEventListener('click', _onControlRightClick);
  controlLeft.removeEventListener('click', _onControlLeftClick);
  controlClose.removeEventListener('click', _onCloseClick);
}

module.exports.showGallery = showGallery;
module.exports.getPicDescr = getPicDescr;
