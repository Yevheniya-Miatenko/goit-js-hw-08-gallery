import images from './gallery-items.js';

const refs = {
  list: document.querySelector('.js-gallery'),
  closeBtn: document.querySelector("[data-action='close-lightbox']"),
  bigImg: document.querySelector('.lightbox__image'),
  backdrop: document.querySelector('.js-lightbox'),
  backdropOverlay: document.querySelector('.lightbox__overlay'),
};

const sources = images.map(img => img.original);

const createListMarkup = images =>
  images
    .map(
      ({ preview, original, description }) =>
        `<li class="gallery__item"><a
    class="gallery__link"
    href="${original}"
  ><img class="gallery__picture" data-source=${original} src=${preview} alt="${description}"/></li></a>`,
    )
    .join('');

const handleModalOpening = event => {
  refs.backdrop.classList.add('is-open');
  refs.bigImg.src = event.target.dataset.source;
};
const handleModalClosing = () => {
  refs.backdrop.classList.remove('is-open');
  refs.bigImg.src = '';
  window.removeEventListener('keydown', handleKeyPress);
  refs.closeBtn.removeEventListener('click', handleModalClosing);
  refs.backdrop.removeEventListener('click', handleBackdropClick);
};

const showNextPic = () => {
  let currentPic = sources.indexOf(refs.bigImg.src);
  if (currentPic === sources.length - 1) {
    currentPic = -1;
  }
  refs.bigImg.src = sources[currentPic + 1];
};
const showPreviousPicture = () => {
  let currentPic = sources.indexOf(refs.bigImg.src);
  if (currentPic === 0) {
    currentPic = sources.length - 1;
  }
  refs.bigImg.src = sources[currentPic - 1];
};

const handleKeyPress = event => {
  if (event.code === 'ArrowRight') {
    showNextPic();
  }
  if (event.code === 'ArrowLeft') {
    showPreviousPicture();
  }
  if (event.code === 'Escape') {
    handleModalClosing();
  }
};
const handleBackdropClick = event => {
  if (event.target === refs.backdropOverlay) {
    handleModalClosing();
  }
};

const listMarkup = createListMarkup(images);
refs.list.innerHTML = listMarkup;

refs.links = document.querySelectorAll('.gallery__link');
refs.links.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
  });
});

refs.list.addEventListener('click', event => {
  if (event.target.nodeName !== 'IMG') {
    return;
  }

  handleModalOpening(event);

  window.addEventListener('keydown', handleKeyPress);

  refs.closeBtn.addEventListener('click', handleModalClosing);

  refs.backdrop.addEventListener('click', handleBackdropClick);
});