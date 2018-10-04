'use strict';

/* global bookmarks */

function main() {
  bookmarks.fetchBookmarks();
  bookmarks.bindControllers();
}

$(main);
