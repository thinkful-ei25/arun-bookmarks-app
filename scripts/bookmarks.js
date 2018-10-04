'use strict';

/* global api, store */

// eslint-disable-next-line no-unused-vars
const bookmarks = (function bookmarksModule() {
  const MAX_STARS = 5;

  function generateRatingStars(numStars) {
    const stars = [];

    for (let i = 0; i < numStars; i += 1) {
      stars.push('<i class="fas fa-star"></i>');
    }

    for (let i = 0; i < MAX_STARS - numStars; i += 1) {
      stars.push('<i class="far fa-star"></i>');
    }

    return stars.join('');
  }

  function renderBookmark(bookmark) {
    return `
      <li>
        <article class="bookmark js-bookmark" data-bookmark-id="${bookmark.id}">
          <header class="js-bookmark__header">
            <h2>${bookmark.title}</h2>
            <section class="bookmark-rating">
              ${generateRatingStars(bookmark.rating)}
            </section>
          </header>
        </article>
      </li>
    `;
  }

  function renderDisplayControls() {
    return `
      <section class="display-controls">
        <button class="js-add-bookmark" type="button">Add Bookmark</button>
        <select class="js-ratings-filter">
          <option value="">Filter by rating</option>
          <option value="1">&gt; 1</option>
          <option value="2">&gt; 2</option>
          <option value="3">&gt; 3</option>
          <option value="4">&gt; 4</option>
        </select>
      </section>
    `;
  }

  function renderBookmarksList() {
    const bookmarkElements = store.bookmarks.map(renderBookmark).join('');

    return `
      <section class="bookmark-list">
        <ul>
          ${bookmarkElements}
        </ul>
      </section>
    `;
  }

  function renderBookmarkView() {
    return `
      ${renderDisplayControls()}
      ${renderBookmarksList()}
    `;
  }

  function renderCreateBookmarkView() {}

  function render() {
    let html = null;
    switch (store.mode) {
      case store.MODES.DISPLAY: {
        html = renderBookmarkView();
        break;
      }

      case store.MODES.CREATE_BOOKMARK: {
        html = renderCreateBookmarkView();
        break;
      }

      default: {
        throw new Error(`Inconsistent internal state: store.mode=${store.mode}`);
      }
    }

    $('.js-app').html(html);
  }

  function fetchBookmarks() {
    api.getBookmarks((bookmarkResponse) => {
      store.setBookmarks(bookmarkResponse);
      render();
    });
  }

  function getIDFromElement(element) {
    return $(element).closest('.js-bookmark').attr('data-bookmark-id');
  }

  function bindDetailedViewController() {
    $('.js-app').on('click', '.js-bookmark__header', (event) => {
      const id = getIDFromElement(event.currentTarget);
      store.toggleExpandedForID(id);
      render();
    });
  }

  function bindControllers() {
    bindDetailedViewController();
  }

  return {
    fetchBookmarks,
    bindControllers,
  };
})();
