'use strict';

// eslint-disable-next-line no-unused-vars
const api = (function apiModule() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/arun/bookmarks';

  function getBookmarks(callback) {
    $.ajax({
      url: BASE_URL,
      method: 'GET',
      dataType: 'json',
      success: callback,
    });
  }

  return {
    getBookmarks,
  };
})();
