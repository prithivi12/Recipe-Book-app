import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeViews.js';
import resultViews from './views/resultViews.js';
import searchView from './views/searchView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeViews from './views/addRecipeViews.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    resultViews.update(model.getSearchResultPage());

    bookmarkView.update(model.state.bookmarks);
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchRecipe = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultViews.renderSpinner();
    await model.loadSearchResult(query);

    // resultViews.render(model.state.search.results);
    resultViews.render(model.getSearchResultPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (gotopage) {
  resultViews.render(model.getSearchResultPage(gotopage));

  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  model.updateServing(newServing);
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddrecipe = async function (newRecipe) {
  try {
    addRecipeViews.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addRecipeViews.renderMessage();

    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeViews.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('🤯', err);
    addRecipeViews.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addhandlerSearch(controlSearchRecipe);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeViews.addHandlerUpload(controlAddrecipe);
};
init();
