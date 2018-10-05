'use strict';

/* global api, store */

// eslint-disable-next-line no-unused-vars
const bookmarks = (function bookmarksModule() {
  function generateRatingStars(numStars) {
    const stars = [];

    for (let i = 0; i < numStars; i += 1) {
      stars.push('<i class="fas fa-star"></i>');
    }

    for (let i = 0; i < store.MAX_RATING - numStars; i += 1) {
      stars.push('<i class="far fa-star"></i>');
    }

    return stars.join('');
  }

  function renderExpandedBookmark(bookmark) {
    const description = bookmark.description ? `<p>${bookmark.description}</p>` : '';
    return `
      ${description}
      <a href="${bookmark.url}"><button type="button">Visit Site</button></a>
      <button class="js-delete-bookmark" type="button"><i class="far fa-trash-alt"></i></button>
    `;
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
          ${bookmark.isExpanded ? renderExpandedBookmark(bookmark) : ''}
        </article>
      </li>
    `;
  }

  function renderDropdownOptions() {
    const options = [];

    for (let i = 0; i < store.MAX_RATING; i += 1) {
      const selected = store.filters.minRating === i;
      const text = i === 0 ? 'Filter by Rating' : `&gt; ${i}`;
      const option = `
        <option value="${i}" ${selected ? 'selected' : ''}>${text}</option>
      `;
      options.push(option);
    }

    return options.join('');
  }

  function renderDisplayControls() {
    return `
      <section class="display-controls">
        <button class="js-add-bookmark" type="button">Add Bookmark</button>
        <select class="js-ratings-filter">
          ${renderDropdownOptions()}
        </select>
      </section>
    `;
  }

  function renderBookmarksList() {
    const bookmarkElements = store.bookmarks
      .filter(bookmark => bookmark.rating > store.filters.minRating)
      .map(renderBookmark)
      .join('');

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

  function renderCreateBookmarkView() {
    return `
      <header>
        <h2>Add Bookmark</h2>
      </header>
      <form class="add-bookmark-form js-add-bookmark-form">
        <fieldset>
          <div class="add-bookmark-form__row">
            <label for="title" class="add-bookmark-form__label">Title</label>
            <input type="text" name="title" id="title" class="add-bookmark-form__input">
          </div>
          <div class="add-bookmark-form__row">
            <label for="url" class="add-bookmark-form__label">URL</label>
            <input type="url" name="url" id="url" class="add-bookmark-form__input">
          </div>
          <div class="add-bookmark-form__row">
            <label for="description" class="add-bookmark-form__label">Description</label>
            <textarea
                name="desc"
                id="description"
                class="add-bookmark-form__input add-bookmark-form__textarea">
            </textarea>
          </div>
          <div class="add-bookmark-form__row">
            <label for="rating" class="add-bookmark-form__label">Rating</label>
            <input
                type="number"
                name="rating"
                id="rating"
                min="1"
                max="${store.MAX_RATING}"
                step="1"
                class="add-bookmark-form__input">
          </div>

          <button type="submit">Submit</button>
        </fieldset>
      </form>
    `;
  }

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
    return $(element)
      .closest('.js-bookmark')
      .attr('data-bookmark-id');
  }

  function onClickAddButton() {
    store.setMode(store.MODES.CREATE_BOOKMARK);
    render();
  }

  function extractFormDataFromElement(element) {
    const formData = new FormData(element);
    return Array.from(formData).reduce((acc, [key, val]) => Object.assign(acc, { [key]: val }), {});
  }

  function onSubmitAddbookmarkForm(event) {
    event.preventDefault();
    const data = extractFormDataFromElement(event.currentTarget);
    api.createBookmark(data, (bookmark) => {
      store.addBookmark(bookmark);
      store.setMode(store.MODES.DISPLAY);
      render();
    });
  }

  function bindDetailedViewController() {
    $('.js-app').on('click', '.js-bookmark__header', (event) => {
      const id = getIDFromElement(event.currentTarget);
      store.toggleExpandedForID(id);
      render();
    });
  }

  function bindFilterController() {
    $('.js-app').on('change', '.js-ratings-filter', (event) => {
      const value = $(event.currentTarget).val();
      store.setMinRating(parseInt(value, 10));
      render();
    });
  }

  function bindAddBookmarkController() {
    $('.js-app').on('click', '.js-add-bookmark', onClickAddButton);
    $('.js-app').on('submit', '.js-add-bookmark-form', onSubmitAddbookmarkForm);
  }

  function bindRemoveBookmarkController() {
    $('.js-app').on('click', '.js-delete-bookmark', (event) => {
      const id = getIDFromElement(event.currentTarget);
      api.deleteBookmark(id, () => {
        store.removeBookmarkWithID(id);
        render();
      });
    });
  }

  function bindControllers() {
    bindDetailedViewController();
    bindFilterController();
    bindAddBookmarkController();
    bindRemoveBookmarkController();
  }

  return {
    fetchBookmarks,
    bindControllers,
  };
}());
