// using lib: https://github.com/davidmerfield/randomColor => provide randomColor() function
/*1. initialization empty array
    2. initialization array contains list 8 color get by libary provided
    3. random position of color less than or equal 'count' input using forloop
  =>  1 color will has structure same as below : 
          randomColor({
          luminosity: 'dark', // color type
          hue:  - get color from list( step 2 ) and limit it less than 8
          });
    4. push obj above to empty array (step 1) 
    5. after get 8 colors, we need double it to be given list with 16 colors, inside will have 2 colors is duplicate - init an array contain 2 array in step 2 => using spread operator
    6. return last an array and do random them
  */
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

function shuffle(array) {
  if (!Array.isArray(array) || array.length <= 2) return array

  for (let i = array.length - 1; i > 1; i--) {
    const indexRandom = Math.floor(Math.random() * i)
    // create a number random less than i
    // toggle
    let temp = array[i]
    array[i] = array[indexRandom]
    array[indexRandom] = temp
  }
}
export const getRandomColorPairs = (count) => {
  const colorList = [] // receive  list  contain 8 colot
  // 8 hue color provided by libary
  const allColorWillUse = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'monochrome',
  ]
  for (let i = 0; i < count; i++) {
    const color = randomColor({
      luminosity: 'dark',
      hue: allColorWillUse[i % allColorWillUse.length],
      // make sure index must less than the length of list color ( < 8)
    })
    colorList.push(color)
  }
  //double color list
  const colorInGame = [...colorList, ...colorList]
  shuffle(colorInGame)
  return colorInGame
}

// show play again button
export function showPlayAgainButton() {
  const btnPlayAgain = getGameButtonElement()
  if (btnPlayAgain) btnPlayAgain.classList.add('show')
}
export function hidePlayAgainButton() {
  const btnPlayAgain = getGameButtonElement()
  if (btnPlayAgain) btnPlayAgain.classList.remove('show')
}
export function setTimerText(text) {
  const timerText = getTimerElement()
  if (timerText) timerText.textContent = text
}

// create timer
// cứ mỗi giây gọi onChange 1 lần , hết tgian gọi onFinish
export function createTimer({ seconds, onChange, onFinish }) {
  let intervalID = null

  function start() {
    clear() // đảm bảo bạn  đã clear interval mới set lại cái mới
    let currentSecond = seconds
    intervalID = setInterval(() => {
      // if(onChange) do some... same below
      onChange?.(currentSecond)
      currentSecond--

      if (currentSecond < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }
  function clear() {
    clearInterval(intervalID)
  }

  return {
    start,
    clear,
  }
}
