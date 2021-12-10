export function getColorElementList() {
  return document.querySelectorAll('#colorList > li')
}
export function getAllElementNotActive() {
  return document.querySelectorAll('#colorList >li:not(.active)')
  //  you can check by get li element not contain class 'active' -> if list is empty, mean all had class 'active'
}

export function getTimerElement() {
  return document.querySelector('.game .game__timer')
}

export function getGameButtonElement() {
  return document.querySelector('.game .game__button')
}

export function getPlayAgainButton() {
  return document.querySelector('.game .game__button')
}

export function getColorBackground() {
  return document.querySelector('.color-background')
}
export function getColorListElement() {
  return document.getElementById('colorList')
}

export function getSectionElement() {
  return document.querySelector('section')
}
