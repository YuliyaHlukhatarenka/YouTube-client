export default class PageModel {
  constructor(XMLHttpRequest) {
    this.XMLHttpRequest = XMLHttpRequest;
    this.videos = [];
    this.nextPageToken = '';
  }

  getVideoArray(searchStr, fn, videoPerPage, currentPage) {
    let pageToken = '';
    if ((this.videos.length - videoPerPage * currentPage) < 5) {
      pageToken = this.nextPageToken;
    }
    if (searchStr !== '' || pageToken !== '') {
      const xhr = new this.XMLHttpRequest();
      xhr.open(
        'GET',
        `https://www.googleapis.com/youtube/v3/search?pageToken=${pageToken}&key=AIzaSyBWtxPSToPQnHGveWXFkzYD1ICAh8XJeV4&type=video&part=snippet&maxResults=15&q=${searchStr}`,
        false,
      );
      xhr.send();
      if (xhr.status !== 200) {
        throw new Error(xhr.status.concat(xhr.statusText));
      } else {
        const newResponse = JSON.parse(xhr.responseText);
        if (pageToken !== '') {
          this.videos = this.videos.concat(newResponse.items);
          this.nextPageToken = newResponse.nextPageToken;
        } else {
          this.videos = newResponse.items;
          this.nextPageToken = newResponse.nextPageToken;
        }
      }
    }
    const resp = this.videos.slice((currentPage - 1) * videoPerPage, currentPage * videoPerPage);
    fn(resp);
  }

  getRate(id) {
    const xhr = new this.XMLHttpRequest();
    xhr.open('GET', `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=AIzaSyDWZ7h4sS6Z1YIrVy6kahJNvX-9WQdakvs&part=statistics`, false);
    xhr.send();
    if (xhr.status !== 200) {
      throw new Error(xhr.status.concat(xhr.statusText));
    } else {
      return JSON.parse(xhr.responseText);
    }
  }
}
