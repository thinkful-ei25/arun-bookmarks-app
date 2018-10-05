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

  function parseError(error) {
    if (error.status === 400) {
      return new Error(error.responseJSON.message);
    }

    return new Error(
      'An error coccured while communicating with our servers. Please contact an administrator for assistance.',
    );
  }

  function getBookmarks(callback) {
    $.ajax({
      url: BASE_URL,
      method: 'GET',
      dataType: 'json',
      success: response => callback(null, decorateBookmarkArray(response)),
      error: error => callback(parseError(error), null),
    });
  }

  function createBookmark(bookmark, callback) {
    $.ajax({
      url: BASE_URL,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bookmark),
      success: response => callback(null, decorateBookmark(response)),
      error: error => callback(parseError(error), null),
    });
  }

  function deleteBookmark(id, callback) {
    $.ajax({
      url: `${BASE_URL}/${id}`,
      method: 'DELETE',
      success: () => callback(null, callback),
      error: error => callback(parseError(error), null),
    });
  }

  return {
    getBookmarks,
    createBookmark,
    deleteBookmark,
  };
}());
