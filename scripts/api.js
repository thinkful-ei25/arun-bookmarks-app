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
      'An error coccured while communicating with our servers. Please try again later.',
    );
  }

  function getBookmarks(callback) {
    $.ajax({
      url: BASE_URL,
      method: 'GET',
      dataType: 'json',
      success: response => callback(decorateBookmarkArray(response)),
    });
  }

  function createBookmark(bookmark, callback) {
    $.ajax({
      url: BASE_URL,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bookmark),
      success: response => callback(decorateBookmark(response)),
    });
  }

  function deleteBookmark(id, callback) {
    $.ajax({
      url: `${BASE_URL}/${id}`,
      method: 'DELETE',
      success: callback,
    });
  }

  return {
    getBookmarks,
    createBookmark,
    deleteBookmark,
  };
}());
