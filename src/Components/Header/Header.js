import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  width: 100%;
  height: 100px;
`

const Title = styled.div`
  font-size: 45px;
  margin: 33px 55px;
  font-weight: 700;
  color: #61dafb;
`

class Header extends React.Component {
  render() {
    return (
      <Root>
        <Title>RE4CT</Title>
      </Root>
    )
  }
}

export default Header
