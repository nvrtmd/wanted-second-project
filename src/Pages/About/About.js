import React from 'react'
import styled from 'styled-components'

class About extends React.Component {
  render() {
    return (
      <>
        <Container>
          <Title>[Assignment 2] 미스터카멜</Title>
          <SubTitle>What Customers Like To View</SubTitle>
          <Members>민유지🐥, 백진수😺, 문태웅🐻, 최혜린🐧</Members>
          <div>21.07.29 - 21.07.31</div>
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
`
const Title = styled.div`
  font-size: 40px;
  font-weight: bold;
`
const SubTitle = styled.div`
  font-size: 27px;
  font-weight: bold;
`

const Members = styled.div`
  font-size: 20px;
  font-weight: 700;
`

export default About
