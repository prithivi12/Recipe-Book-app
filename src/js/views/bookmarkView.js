import View from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage =
    'No bookmarks yet. Find the a nice recipe and bookmarks it !!';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    console.log(this._data);

    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new BookmarksView();
