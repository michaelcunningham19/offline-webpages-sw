// See docs for options info
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
function swRegistration(path, options) {
  if (typeof path !== 'string') {
    throw new Error('Function swRegistration requires "path" to be a string.');
  }

  options = options || {};

  return navigator.serviceWorker.register(path, options)
    .then(swRegistrationSuccess.bind(this, path))
    .catch(swRegistrationError);
};

function swRegistrationSuccess(path, registration) {

  if (registration.installing) {
    console.log('Service worker at "' + path + '" is installing.');
  } else if (registration.waiting) {
    console.log('Service worker at "' + path + '" is installed.');
  } else if (registration.active) {
    console.log('Service worker at "' + path + '" is active.');
  }

  // Service worker is now registered and now runs inside of a Worker context
  // and therefore has no DOM access.
};

function swRegistrationError (error) {
  console.log('SW Registration failed with error: ', error);
};

function swRegistrationComplete () {

  // Do other things here :)

};

function onLoad () {
  // Test if the browser can support Service Workers.
  // The origin must also be served over HTTPS except localhost
  if ('serviceWorker' in navigator) {
    swRegistration('/sw.js').then(swRegistrationComplete)
  } else {
    console.log('Your browser does not support service workers.');
  }
};

window.addEventListener('load', onLoad);