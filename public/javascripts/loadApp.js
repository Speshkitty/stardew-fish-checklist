'use strict';

function load(url) {

  return new Promise(function(resolve, reject) {

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function() {
      resolve(this.response);
    });
    xhr.open('get', url);
    xhr.responseType = 'json';
    xhr.send();
  });
}

function loadFishes() {

  return new Promise(function(resolve, reject) {
    load('/data/fishes.json')
      .then(function(response) {
        resolve(response);
      });
  });
}

function loadFishLocations() {

  return new Promise(function(resolve, reject) {
    load('/data/fish_locations.json')
      .then(function(response) {
        resolve(response);
      });
  });
}

function saveFishesAndLoadLocations(response) {
  fishes = response;
  return loadFishLocations();
}

function saveFishLocations(response) {
  fishLocations = response;
}

function renderFish() {
  var docFrag = document.createDocumentFragment();
  fishes.forEach(function(fish) {
    var el = document.createElement('fish-component');
    el.setAttribute('name', fish.name);
    docFrag.appendChild(el);
  });
  document.getElementById('app').appendChild(docFrag);
}

var fishes, fishLocations;

loadFishes()
  .then(saveFishesAndLoadLocations)
  .then(saveFishLocations)
  .then(renderFish);