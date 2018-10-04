'use strict';

// eslint-disable-next-line no-unused-vars
const store = (function storeModule() {
  const MODES = {
    DISPLAY: Symbol('Mode: Display'),
    CREATE_BOOKMARK: Symbol('Mode: Create Bookmark'),
  };

  function setBookmarks(bookmarks) {
    this.bookmarks = bookmarks;
  }

  return {
    MODES,

    bookmarks: [],
    mode: MODES.DISPLAY,
    filter: { minRating: null },

    setBookmarks,
  };
})();
