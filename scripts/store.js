'use strict';

// eslint-disable-next-line no-unused-vars
const store = (function storeModule() {
  const MODES = {
    DISPLAY: Symbol('Mode: Display'),
    CREATE_BOOKMARK: Symbol('Mode: Create Bookmark'),
  };

  return {
    MODES,

    bookmarks: [],
    mode: MODES.DISPLAY,
    filter: { minRating: null },
  };
})();
