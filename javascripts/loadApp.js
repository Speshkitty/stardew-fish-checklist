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

function combineFishAndLocations(responses) {

  let fishes = responses[0];
  let fishLocations = responses[1];

  var caughtMap = JSON.parse(localStorage.getItem('caughtMap') || '{}');

  var fishLocationMap = fishLocations.reduce(function(memo, fishLocation) {
    if (!memo[fishLocation.fish_id]) {
      memo[fishLocation.fish_id] = [];
    }
    memo[fishLocation.fish_id].push(fishLocation);
    return memo;
  }, {});
  fishes = fishes.map(function(fish) {

    // We are expecting caughtMap[fish.id] to be true, false... normally I could check existance before
    // assigning fish.caught, but false is falsey..
    if (typeof caughtMap[fish.id] !== 'undefined') {
      fish.caught = caughtMap[fish.id];
    }

    fish.locations = fishLocationMap[fish.id];
    return fish;
  });

  return fishes;
}

function renderFish(fishes) {

  var fishTank = document.createElement('fish-tank-component');
  fishTank.setAttribute('fishes', JSON.stringify(fishes));
  document.getElementById('app').appendChild(fishTank);
}

var fishes, fishLocations;

Promise.all([loadFishes(), loadFishLocations()])
  .then(combineFishAndLocations)
  .then(renderFish);