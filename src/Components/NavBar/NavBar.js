import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  position: fixed;
  bottom: 0;
  width: 768px;
  display: flex;
  justify-content: space-between;
  border-top: solid 0.5px #000;
`

const Box = styled.div`
  margin: 15px 40px;
  text-align: center;
  font-weight: 600;
`

const MenuImg = styled.img`
  width: 45px;
`

class NavBar extends React.Component {
  render() {
    return (
      <Root>
        <Box>
          <MenuImg src="https://ifh.cc/g/GPTkLn.png" />
          <p>ABOUT</p>
        </Box>
        <Box>
          <MenuImg src="https://ifh.cc/g/AV25um.png" />
          <p>HOME</p>
        </Box>
        <Box>
          <MenuImg src="https://ifh.cc/g/l9leMX.png" />
          <p>HISTORY</p>
        </Box>
      </Root>
    )
  }
}

export default NavBar
