
export default class PageView {
  constructor(element) {
    this.element = element;
    this.firstPageInPagingFrame = 1;
    this.onClickEnterInSearch = null;
    this.switchToNextPage = null;
    this.swipeStart = null;
    this.swipeEnd = null;
    this.openVideo = null;
  }

  pageLoad() {
    const fragment = this.element.document.createDocumentFragment();
    const searchContainer = this.element.document.createElement('div');
    const searcher = this.element.document.createElement('input');
    searcher.setAttribute('type', 'text');
    searcher.setAttribute('id', 'input-text');
    searcher.className = 'searcher-input';
    searcher.onkeyup = this.onClickEnterInSearch;
    searchContainer.appendChild(searcher);
    fragment.appendChild(searchContainer);

    const videosContainer = this.element.document.createElement('div');
    videosContainer.className = 'videos-container';
    videosContainer.id = 'videos';
    fragment.appendChild(videosContainer);

    const dotsContainer = this.element.document.createElement('div');
    dotsContainer.className = 'navigation-dots';
    dotsContainer.id = 'dots';
    fragment.appendChild(dotsContainer);

    this.element.document.body.appendChild(fragment);
  }

  render(videosArray, currentPage, numOfPage) {
    function openVideo(id) {
      window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
    }
    const videosSection = this.element.document.getElementById('videos');
    videosSection.style.setProperty('--i', '0');
    videosSection.innerHTML = '';

    for (let i = 0; i < videosArray.length; i += 1) {
      const videoContainer = this.element.document.createElement('div');
      videoContainer.className = 'video-section';
      videoContainer.id = `${i}`;
      const videoImg = this.element.document.createElement('img');
      videoImg.setAttribute('src', `${videosArray[i].thumbnails}`);
      videoImg.setAttribute('alt', 'video thumbnail');
      videoContainer.appendChild(videoImg);
      videoImg.style.width = '300px';
      videoImg.style.height = '200px';
      videoContainer.style.height = '100%';
      const titleContainer = this.element.document.createElement('div');
      titleContainer.className = 'video-title';
      titleContainer.addEventListener('mousedown', () => { openVideo(videosArray[i].id); });
      titleContainer.innerHTML = `<p>${videosArray[i].title}</p>`;
      videoContainer.appendChild(titleContainer);

      const descriptionContainer = this.element.document.createElement('div');
      descriptionContainer.className = 'video-description';
      descriptionContainer.innerHTML = `<p>${videosArray[i].description}</p>`;
      videoContainer.appendChild(descriptionContainer);

      const authorContainer = this.element.document.createElement('div');
      authorContainer.className = 'video-description';
     // authorContainer.innerHTML = `<p>${videosArray[i].description}</p>`;
     //videoContainer.appendChild(descriptionContainer);

      const publishedAtContainer = this.element.document.createElement('div');
      publishedAtContainer.className = 'video-description';
      publishedAtContainer.innerHTML = `<p>${videosArray[i].publishedAt}</p>`;
      videoContainer.appendChild(publishedAtContainer);

      const rateContainer = this.element.document.createElement('div');
      rateContainer.className = 'video-description';
      //rateContainer.innerHTML = `<p>${videosArray[i].rate}</p>`;

      videosSection.appendChild(videoContainer);

    }

    const dotContainer = this.element.document.getElementById('dots');
    dotContainer.innerHTML = '';

    let spanDot = this.element.document.createElement('span');
    spanDot.className = 'dot';
    spanDot.innerHTML = '<span>&#60</span>';
    if (currentPage === 1) {
      spanDot.style.background = 'grey';
    } else {
      spanDot.onclick = this.switchToNextPage;
    }
    dotContainer.appendChild(spanDot);

    let firstPage = 1;
    if (currentPage > numOfPage + this.firstPageInPagingFrame - 1) {
      this.firstPageInPagingFrame += 1;
      firstPage = this.firstPageInPagingFrame;
    }
    if (currentPage < this.firstPageInPagingFrame) {
      this.firstPageInPagingFrame = currentPage;
    }
    if (currentPage < this.firstPageInPagingFrame + numOfPage) {
      firstPage = this.firstPageInPagingFrame;
    }
    for (let i = firstPage; i < firstPage + numOfPage; i += 1) {
      spanDot = this.element.document.createElement('span');
      spanDot.className = 'dot';
      spanDot.title = currentPage;
      if (i === currentPage) {
        spanDot.className = 'dot dot-active';
      }
      spanDot.innerHTML = `<span>${i}</span>`;

      spanDot.onclick = this.switchToNextPage;
      dotContainer.appendChild(spanDot);
    }
    spanDot = this.element.document.createElement('span');
    spanDot.className = 'dot';
    spanDot.innerHTML = '<span>&#62</span>';
    spanDot.onclick = this.switchToNextPage;
    dotContainer.appendChild(spanDot);


    this.element.document.getElementById('videos').addEventListener('mousedown', this.swipeStart);
    this.element.document.getElementById('videos').addEventListener('touchstart', this.swipeStart, false);

    this.element.document.getElementById('videos').addEventListener('mousedown', (e) => { e.preventDefault(); });
    this.element.document.getElementById('videos').addEventListener('touchmove', (e) => { e.preventDefault(); }, false);

    this.element.document.getElementById('videos').addEventListener('mouseup', this.swipeEnd);
    this.element.document.getElementById('videos').addEventListener('touchend', this.swipeEnd, true);


  }

}
