import React from 'react'
import ReactDOM from 'react-dom'
import SaveDataToLocalStorage from './utils/SaveDataToLocalStorage'
import Routes from './Routes'
import GlobalStyle from './styles/GlobalStyle'

ReactDOM.render(
  <>
    <GlobalStyle />
    <Routes />
  </>,
  document.getElementById('root')
)

function timer() {
  let isCorrectedTime = false
  let isChecked = false

  setInterval(() => {
    const hours = new Date().getHours()

    if (hours === 19) {
      isCorrectedTime = true

      if (isCorrectedTime && !isChecked) {
        SaveDataToLocalStorage('watched', null)
        isChecked = true
      }
    } else {
      if (!isCorrectedTime && !isChecked) return

      isCorrectedTime = false
      isChecked = false
    }
  }, 5000)
}

timer()
