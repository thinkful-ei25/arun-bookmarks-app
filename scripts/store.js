'use strict';

// eslint-disable-next-line no-unused-vars
const store = (function storeModule() {
  const MODES = {
    DISPLAY: Symbol('Mode: Display'),
    CREATE_BOOKMARK: Symbol('Mode: Create Bookmark'),
  };

  function findBookmarkWithIDFromBookmarks(id, bookmarks) {
    return bookmarks.find(bookmark => bookmark.id === id);
  }

  function setBookmarks(bookmarks) {
    this.bookmarks = bookmarks;
  }

  function toggleExpandedForID(id) {
    const bookmark = findBookmarkWithIDFromBookmarks(id, this.bookmarks);
    bookmark.isExpanded = !bookmark.isExpanded;
  }

  function setMinRating(rating) {
    this.filters.minRating = rating || 0;
  }

  return {
    MODES,
    MAX_RATING: 5,

    bookmarks: [],
    mode: MODES.DISPLAY,
    filters: { minRating: 0 },

    setBookmarks,
    toggleExpandedForID,
    setMinRating,
  };
}());
