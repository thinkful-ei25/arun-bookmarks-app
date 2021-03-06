'use strict';

/* global api, store */

// eslint-disable-next-line no-unused-vars
const bookmarks = (function bookmarksModule() {
  function generateRatingStars(numStars) {
    const stars = [];

    for (let i = 0; i < store.MAX_RATING; i += 1) {
      stars.push(`<i class="fa${i < numStars ? 's' : 'r'} fa-star" aria-hidden="true"></i>`);
    }

    return stars.join('');
  }

  function renderExpandedBookmark(bookmark) {
    const description = bookmark.description ? `<p>${bookmark.description}</p>` : '';
    return `
      ${description}
      <div class="bookmark-controls">
        <a href="${bookmark.url}"><button class="bookmark-controls__button" type="button">Visit Site</button></a>
        <button class="bookmark-controls__button bookmark-controls__delete_button js-delete-bookmark" type="button" title="Delete bookmark" aria-label="Delete bookmark"><i class="far fa-trash-alt" aria-hidden="true"></i></button>
      </div>
    `;
  }

  function renderBookmark(bookmark) {
    const accessibleRating = bookmark.rating
      ? `${bookmark.rating} out of 5 stars`
      : 'Bookmark is unrated';
    return `
      <li>
        <article class="bookmark js-bookmark" data-bookmark-id="${bookmark.id}">
          <header class="bookmark__header js-bookmark__header">
            <h2 class="bookmark__h2">${bookmark.title}</h2>
            <span title="${accessibleRating}" aria-label="${accessibleRating}" class="bookmark__rating">
              ${generateRatingStars(bookmark.rating)}
            </span>
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
      <section class="display-controls" aria-label="Application controls">
        <button class="js-add-bookmark" type="button">Add Bookmark</button>
        <select class="display-controls--right js-ratings-filter" aria-label="Filter by Rating" title="Filter bookmarks by rating">
          ${renderDropdownOptions()}
        </select>
      </section>
    `;
  }

  function renderBookmarksList() {
    const bookmarkElements = store.bookmarks
      .filter(bookmark => !store.filters.minRating || bookmark.rating > store.filters.minRating)
      .map(renderBookmark)
      .join('');

    return `
      <section class="bookmark-list" aria-label="List of bookmarks">
        <ul>
          ${bookmarkElements}
        </ul>
      </section>
    `;
  }

  function renderErrorSection() {
    return `
      <section class="flash--error">
        <p>${store.errorMessage}</p>
      </section>
    `;
  }

  function renderBookmarkView() {
    if (store.errorMessage) {
      return renderErrorSection();
    }

    return `
      ${renderDisplayControls()}
      ${renderBookmarksList()}
    `;
  }

  function renderCreateBookmarkView() {
    return `
      <header>
        <h2 class="add-bookmark__h2">Add Bookmark</h2>
      </header>
      ${store.errorMessage ? renderErrorSection() : ''}
      <form class="add-bookmark-form js-add-bookmark-form">
        <div class="add-bookmark-form__row">
          <label for="title" class="add-bookmark-form__label">Title</label>
          <input type="text" name="title" id="title" class="add-bookmark-form__input">
        </div>
        <div class="add-bookmark-form__row">
          <label for="url" class="add-bookmark-form__label">URL</label>
          <input type="url" name="url" id="url" class="add-bookmark-form__input">
        </div>
        <div class="add-bookmark-form__row">
          <label for="description" class="add-bookmark-form__label">Description <span class="add-bookmark-form__optional_label">Optional</span></label>
          <textarea
              name="desc"
              id="description"
              class="add-bookmark-form__input add-bookmark-form__textarea"></textarea>
        </div>
        <div class="add-bookmark-form__row">
          <label for="rating" class="add-bookmark-form__label">Rating <span class="add-bookmark-form__optional_label">Optional</span></label>
          <input
              type="number"
              name="rating"
              id="rating"
              min="1"
              max="${store.MAX_RATING}"
              step="1"
              class="add-bookmark-form__rating_input">
        </div>

          <button type="submit">Submit</button>
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
    store.setErrorMessage(null);
    api.getBookmarks((error, bookmarkResponse) => {
      if (error) {
        store.setErrorMessage(error.message);
      }

      if (bookmarkResponse) {
        store.setBookmarks(bookmarkResponse);
      }

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
    return Array.from(formData).reduce((acc, [key, val]) => {
      if (val) {
        Object.assign(acc, { [key]: val });
      }
      return acc;
    }, {});
  }

  function onSubmitAddbookmarkForm(event) {
    event.preventDefault();
    const data = extractFormDataFromElement(event.currentTarget);

    store.setErrorMessage(null);
    api.createBookmark(data, (error, bookmark) => {
      if (error) {
        store.setErrorMessage(error.message);
      }

      if (bookmark) {
        store.addBookmark(bookmark);
        store.setMode(store.MODES.DISPLAY);
      }

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
      store.setErrorMessage(null);
      api.deleteBookmark(id, (error) => {
        if (error) {
          store.setErrorMessage(error.message);
        } else {
          store.removeBookmarkWithID(id);
        }

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
