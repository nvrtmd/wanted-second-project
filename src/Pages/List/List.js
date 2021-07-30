import React from 'react'
import styled from 'styled-components'
import Header from '../../Components/Header/Header'
import NavBar from '../../Components/NavBar/NavBar'
const Root = styled.div`
  display: flex;
  justify-content: center;
  background: #c0c0c0;
  min-height: 100vh;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  background: #fff;
  width: 768px;
`

class List extends React.Component {
  render() {
    return (
      <Root>
        <Container>
          <Header></Header>
          <NavBar></NavBar>
        </Container>
      </Root>
    )
  }
}

export default List
