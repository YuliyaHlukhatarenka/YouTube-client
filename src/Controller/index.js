export default class PageController {
  constructor(pageView, pageModel) {
    this.pageView = pageView;
    this.pageModel = pageModel;
    this.videoPerPage = 4;
    this.currentPage = 1;
    this.numberOfPagingDots = 2;
    this.x0 = null;
  }

  initialize() {
    this.pageView.onClickEnterInSearch = this.onClickEnterInSearch.bind(this);
    this.showVideos = this.showVideos.bind(this);
    this.measureWindowSize = this.measureWindowSize.bind(this);
    this.redrawOnResize = this.redrawOnResize.bind(this);
    this.pageView.swipeStart = this.swipeStart.bind(this);
    this.pageView.swipeEnd = this.swipeEnd.bind(this);
    this.pageView.switchToNextPage = this.switchToNextPage.bind(this);
    this.pageView.pageLoad();
  }

  onClickEnterInSearch(e) {
    this.measureWindowSize();
    const str = document.getElementById('input-text').value;
    this.currentPage = 1;
    if (e.keyCode === 13) {
      this.pageModel.getVideoArray(str,
        this.showVideos.bind(this),
        this.videoPerPage,
        this.currentPage);
    }
  }

  showVideos(response) {
    const videoArray = [];
    let i = 0;
    response.forEach((element) => {
      videoArray[i] = {};
      videoArray[i].thumbnails = element.snippet.thumbnails.medium.url;
      videoArray[i].title = element.snippet.title;
      videoArray[i].description = element.snippet.description;
      videoArray[i].publishedAt = element.snippet.publishedAt;
      videoArray[i].author = element.snippet.channelTitle;
      videoArray[i].id = element.id.videoId;
      videoArray[i].rate = this.pageModel.getRate(videoArray[i].id).items[0].statistics.viewCount;
      i += 1;
    });

    this.pageView.render(videoArray, this.currentPage, this.numberOfPagingDots);
  }

  measureWindowSize() {
    const screenWidth = document.documentElement.clientWidth;
    this.videoPerPage = 4;
    this.numberOfPagingDots = 2;
    if (screenWidth < 1200) {
      this.videoPerPage = 3;
      this.numberOfPagingDots = 3;
    }
    if (screenWidth < 900) {
      this.videoPerPage = 2;
      this.numberOfPagingDots = 4;

    }
    if (screenWidth < 600) {
      this.videoPerPage = 1;
    }
  }

  redrawOnResize() {
    const firstElementOnPage = (this.currentPage - 1) * this.videoPerPage + 1;
    this.measureWindowSize();
    this.currentPage = Math.ceil(firstElementOnPage / this.videoPerPage);
    this.pageModel.getVideoArray('', this.showVideos.bind(this), this.videoPerPage, this.currentPage);
  }

  switchToNextPage(e) {
    console.log(e);
    if (e.target.innerText === '>') {
      this.currentPage += 1;
    }
    if (e.target.innerText === '<') {
      this.currentPage -= 1;
    }
    if ((e.target.innerText !== '>') && (e.target.innerText !== '<')) {
      this.currentPage = +e.target.innerText;
    }
    //document.querySelector(`#dot${this.currentPage}`).title = this.currentPage;

    this.pageModel.getVideoArray('', this.showVideos.bind(this), this.videoPerPage, this.currentPage);
  }

  swipeStart(e) {
    const evt = e.changedTouches ? e.changedTouches[0] : e;
    this.x0 = evt.clientX;
  }

  swipeEnd(e) {
    const evt = e.changedTouches ? e.changedTouches[0] : e;
    if ((this.x0 - evt.clientX) < 0) {
      if (this.currentPage !== 1) {
        document.getElementById('videos').style.setProperty('--i', '100%');
        this.currentPage -= 1;
        this.pageModel.getVideoArray('', this.showVideos.bind(this), this.videoPerPage, this.currentPage);
      }
    } else {
      document.getElementById('videos').style.setProperty('--i', '-100%');
      this.currentPage += 1;
      this.pageModel.getVideoArray('', this.showVideos.bind(this), this.videoPerPage, this.currentPage);
    }
    this.x0 = null;
  }
}
