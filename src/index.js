import React from 'react'
import ReactDOM from 'react-dom'
import SaveDataToLocalStorage from './utils/SaveDataToLocalStorage'
import Routes from './Routes'
import GlobalStyle from './styles/GlobalStyle'
import 'setupFirebase'
ReactDOM.render(
  <>
    <GlobalStyle />
    <Routes />
  </>,
  document.getElementById('root')
)

// Routes render 후 timer 함수 실행
function timer() {
  let isCorrectedTime = false
  let isChecked = false

  // setInterval 함수: 일정 시간(1000 * 300, 즉, 300초, 5분) 간격으로 작업 수행

  setInterval(() => {
    const hours = new Date().getHours()
    // 현재 시간을 hours 변수에 넣기

    if (hours === 0) {
      // 만약 시간이 0이면
      // isCorrectedTime을 true로 바꿈
      isCorrectedTime = true
      if (isCorrectedTime && !isChecked) {
        // 만약 isCorrectedTime 이 true이고, isChecked가 false이면
        // LocalStorage 초기화한 뒤 isChecked를 true로 바꿈
        SaveDataToLocalStorage('watched', null)
        SaveDataToLocalStorage('interested', null)
        SaveDataToLocalStorage('numOfVisitableProduct', null)
        isChecked = true
      }
    } else {
      // 만약 시간이 0이 아닌데
      if (!isCorrectedTime && !isChecked) return
      // isCorrectedTime과 isChecked가 모두 false라면 return
      // 그 외의 경우 isCorrectedTime과 isChecked가 모두 false로
      isCorrectedTime = false
      isChecked = false
    }
  }, 1000 * 300)
}

timer()
