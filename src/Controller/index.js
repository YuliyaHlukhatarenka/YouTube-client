export default class PageController {
  constructor(pageView, pageModel) {
    this.pageView = pageView;
    this.pageModel = pageModel;
    this.videoPerPage = 4;
    this.searchStr = '';
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
    this.searchStr = document.getElementById('input-text').value;

    if (e.keyCode === 13) {
      this.pageModel.getVideoArray(this.searchStr, this.showVideos.bind(this), this.videoPerPage, this.currentPage);
    }
  }


  showVideos(response) {
    const videoArray = [];
    let i = 0;
    response.forEach((element) => {
      console.log(element);
      videoArray[i] = {};
      videoArray[i].thumbnails = element.snippet.thumbnails.medium.url;
      videoArray[i].title = element.snippet.title;
      videoArray[i].description = element.snippet.description;
      videoArray[i].publishedAt = element.snippet.publishedAt;
      videoArray[i].id = element.id.videoId;
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
    this.measureWindowSize();
    this.pageModel.getVideoArray('', this.showVideos.bind(this), this.videoPerPage, this.currentPage);
  }

  switchToNextPage(e) {
    if (e.target.innerText === '>') {
      this.currentPage += 1;
    }
    if (e.target.innerText === '<') {
      this.currentPage -= 1;
    }
    if ((e.target.innerText !== '>') && (e.target.innerText !== '<')) {
      this.currentPage = +e.target.innerText;
    }

    this.pageModel.getVideoArray('', this.showVideos.bind(this), this.videoPerPage, this.currentPage);
  }

  swipeStart(e) {
    this.x0 = e.clientX;
  }

  swipeEnd(e) {
    if ((this.x0 - e.clientX) > 0) {
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

  static unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }


}
