import React from 'react'
import styled from 'styled-components'

class About extends React.Component {
  render() {
    return (
      <>
        <Container>
          <h1>[Assignment 2] 미스터카멜</h1>
          <Introduce>민유지, 백진수, 문태웅, 최혜린</Introduce>
          <div>made with 💙</div>
        </Container>
      </>
    )
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15vh;
  line-height: 50px;

  h1 {
    font-size: 30px;
    font-weight: bold;
  }
`

const Introduce = styled.div`
  font-size: 18px;
`

export default About
