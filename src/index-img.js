import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formInput = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector(".btn-load");
const apiKey = '38015405-7546e421a34b4b2277fcb8cdc';
const loader = document.querySelector('.loader');

loader.style.display = 'none';
formInput.addEventListener('submit', handleSubmitForm);
window.addEventListener('scroll', handleScroll);
// знаходжу значення інпуту
// чищу галерею
// запускаю запит на api
// loadMoreBtn.style.display = "none";

let currentPage;
let query;

async function handleSubmitForm(event) {
  event.preventDefault();
  currentPage = 1;
  query = event.target.elements.searchQuery.value;
  
  // gallery.innerHTML = '';

   searchImages(query, currentPage);
}

// отримую зображення
// ховаю кнопку лоад
async function searchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  loader.style.display = 'block';
  loader.style.marginLeft = 'auto';
  loader.style.marginRight = 'auto';
  try {
    const response = await axios.get(url);
    const { data } = response;
    const images = data.hits;

    if (images.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      loader.style.display = 'none';
      displayImages(images);
      

      // const totalHits = data.totalHits || 0;
      // const remainingHits = totalHits - page * 40;

      // if (remainingHits > 0) {
      //   loadMoreBtn.style.display = "block";
      // } else {
      //   loadMoreBtn.style.display = "none";
      //   Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      // }
    }
    slider.refresh();
  } catch (error) {
    Notiflix.Notify.failure(`Failed to fetch images: ${error}`);
  }
}

async function loadMoreImages() {
  currentPage += 1;
  await searchImages(query, currentPage);
  loader.style.display = 'none';
}

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    loadMoreImages();
    
  }
}

// перебираю масив
// створюю розмітку

function displayImages(images) {
  const cardsMarkup = images.map(image => {
    return `
      <a href="${image.largeImageURL}" class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
       </a>
    `;
  });

  gallery.insertAdjacentHTML('beforeend', cardsMarkup.join(''));

  let slider = new SimpleLightbox('.gallery a', {
    doubleTapZoom: '1.5',
    captionsData: 'data-parent',
    captionDelay: 250,
    widthRatio: 1.5,
  });

  
}
