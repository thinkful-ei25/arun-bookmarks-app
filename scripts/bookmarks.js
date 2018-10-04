'use strict';

/* global api */

// eslint-disable-next-line no-unused-vars
const bookmarks = (function bookmarksModule() {
  function fetchBookmarks() {
    api.getBookmarks((response) => {
      console.log(response);
    });
  }

  return {
    fetchBookmarks,
  };
})();
