import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getRandomColorPairs,
  showPlayAgainButton,
  hidePlayAgainButton,
  setTimerText,
  createTimer,
} from './utils.js'
import {
  getColorElementList,
  getTimerElement,
  getAllElementNotActive,
  getGameButtonElement,
  getPlayAgainButton,
  getColorBackground,
  getColorListElement,
  getSectionElement,
} from './selectors.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})
function handleTimerChange(seconds) {
  const fullSecond = `0${seconds}`.slice(-2)
  setTimerText(fullSecond)
}

function handleTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED
  setTimerText('Game Over !')
  showPlayAgainButton()
}

const initColors = () => {
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  // get each li
  const liListColors = getColorElementList()

  liListColors.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElement = liElement.querySelector('div .overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}

function isMatchColor(firstData, secondData) {
  if (!firstData || !secondData) return
  const sectionElement = getSectionElement()
  sectionElement.style.backgroundColor = firstData || secondData

  // reset selection list for next turn
  selections = []
}

function isNotMatchColor(firstColorElement, secondColorElement) {
  if (!firstColorElement || !secondColorElement) return
  // trước timeout mình phải block nó đảm bảo chỉ cho click 2 thằng , tránh trường hơp user nhanh tay click th 3
  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    firstColorElement.classList.remove('active')
    secondColorElement.classList.remove('active')

    // reset selection list for next turn
    selections = []
    if (gameStatus !== GAME_STATUS.FINISHED) gameStatus = GAME_STATUS.PLAYING
  }, 250)
}

function isWin() {
  const elementColorNotActive = getAllElementNotActive()
  // nếu số element ko có class active = 0  => tất cả li tag đều đã bật active
  if (elementColorNotActive.length === 0) {
    // all class is active => stop time
    timer.clear()
    setTimerText('You WIN! 😍')
    showPlayAgainButton()
    gameStatus = GAME_STATUS.FINISHED
  }
  selections = []
}

// handle btn play again
function handleResetGame() {
  setTimerText('')
  selections = []
  gameStatus = GAME_STATUS.PLAYING

  const colorElementList = getColorElementList()
  for (const elementColor of colorElementList) {
    elementColor.classList.remove('active')
  }
  hidePlayAgainButton()
  // re-generate new list color
  initColors()
  // start new game
  startTimer()
}

function initReplayBtn() {
  const btnPlayAgain = getGameButtonElement()
  if (!btnPlayAgain) return
  btnPlayAgain.addEventListener('click', handleResetGame)
}

function handleColorClick(colorElement) {
  const handleBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)

  const isClicked = colorElement.classList.contains('active')
  // only allow click 1 time

  if (!colorElement || handleBlockClick || isClicked) return

  colorElement.classList.add('active')
  // handle selection list .. itself contains 1 - 2 color when clicked and  handle compare them

  selections.push(colorElement)
  if (selections.length < 2) return // if selections list less than 2 can not compare

  // selections list  only allow equal 2 to check match ....
  const firstColorElement = selections[0] // li
  const secondColorElement = selections[1]

  // get color setted by dataset in li element
  const firstColorData = firstColorElement.dataset.color // attr
  const secondColorData = secondColorElement.dataset.color

  // check match
  if (firstColorData === secondColorData) {
    isMatchColor(firstColorData, secondColorData)
    // isWin
    isWin()
  } else {
    isNotMatchColor(firstColorElement, secondColorElement)
  }
}

// attact event for UL tag => event delagation
const attactEventForColorList = () => {
  const colorListElement = getColorListElement() // ul
  if (!colorListElement) return

  colorListElement.addEventListener('click', (e) => {
    const colorElement = e.target // li
    if (colorElement.tagName !== 'LI') return // required this is LI tag
    handleColorClick(colorElement)
  })
}
function startTimer() {
  timer.start()
}
// main
;(() => {
  initColors()
  attactEventForColorList()
  initReplayBtn()
  startTimer()
})()
