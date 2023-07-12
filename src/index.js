

export async function loadMoreImages() {
  
    currentPage += 1;
    await searchImages(query, currentPage);
  }

  export function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadMoreImages();
    }
  }

  