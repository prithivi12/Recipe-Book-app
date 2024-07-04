import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   *Render the received object to the DOM
   * @param {Object | Object[]} data The data to be render
   * @param {boolean} [render=true] if false create markup string instead of rendering to the dom
   * @returns {undefined | string } A markup string is return if render=false
   * @this  {Object} View instance
   * @author Prithiv lalchan
   *@todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const makeUp = this._generateMarkup();

    if (!render) return makeUp;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', makeUp);
  }

  update(data) {
    this._data = data;

    const newMakeup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMakeup);

    const newElement = Array.from(newDom.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];

      //update change text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
