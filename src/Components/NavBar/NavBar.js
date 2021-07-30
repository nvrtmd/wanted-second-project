import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Root = styled.div`
  position: fixed;
  bottom: 0;
  width: 768px;
  display: flex;
  justify-content: space-between;
  border-top: solid 0.5px #000;
`

const Box = styled.div`
  margin: 10px 40px;
  text-align: center;
  font-weight: 600;
`

const MenuImg = styled.img`
  width: 35px;
`

class NavBar extends React.Component {
  render() {
    return (
      <Root>
        <Link to="/">
          <Box>
            <MenuImg src="https://ifh.cc/g/GPTkLn.png" />
            <p>ABOUT</p>
          </Box>
        </Link>
        <Link to="/">
          <Box>
            <MenuImg src="https://ifh.cc/g/AV25um.png" />
            <p>HOME</p>
          </Box>
        </Link>
        <Link to="/recentList">
          <Box>
            <MenuImg src="https://ifh.cc/g/l9leMX.png" />
            <p>HISTORY</p>
          </Box>
        </Link>
      </Root>
    )
  }
}

export default NavBar
