'use strict';

export function listen(element, event, callBack) {
  if (element) {
    element.addEventListener(event, callBack);
  } else {
    console.error(`Element is null or undefined for event: ${event}`);
  }
}

export function select(selector) {
  return document.querySelector(selector);
}

export function selectAll(selector) {
  return document.querySelectorAll(selector);
}
