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
    load('./data/fishes.json')
      .then(function(response) {
        resolve(response);
      });
  });
}

function loadFishLocations() {

  return new Promise(function(resolve, reject) {
    load('./data/fish_locations.json')
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

function combineFishAndLocations() {
  var fishLocationMap = fishLocations.reduce(function(memo, fishLocation) {
    if (!memo[fishLocation.fish_id]) {
      memo[fishLocation.fish_id] = [];
    }
    memo[fishLocation.fish_id].push(fishLocation);
    return memo;
  }, {});
  fishes = fishes.map(function(fish) {
    fish.locations = fishLocationMap[fish.id];
    return fish;
  });
}

function renderFish() {

  var fishTank = document.createElement('fish-tank-component');
  fishTank.setAttribute('fishes', JSON.stringify(fishes));
  document.getElementById('app').appendChild(fishTank);
}

var fishes, fishLocations;

loadFishes()
  .then(saveFishesAndLoadLocations)
  .then(saveFishLocations)
  .then(combineFishAndLocations)
  .then(renderFish);