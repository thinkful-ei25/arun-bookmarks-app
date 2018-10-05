'use strict';

// eslint-disable-next-line no-unused-vars
const api = (function apiModule() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/arun/bookmarks';

  function decorateBookmark(bookmark) {
    const { desc, ...decoratedBookmark } = bookmark;
    decoratedBookmark.description = desc;
    return decoratedBookmark;
  }

  function decorateBookmarkArray(response) {
    return response.map(decorateBookmark);
  }

  function getBookmarks(callback) {
    $.ajax({
      url: BASE_URL,
      method: 'GET',
      dataType: 'json',
      success: response => callback(decorateBookmarkArray(response)),
    });
  }

  return {
    getBookmarks,
  };
}());
