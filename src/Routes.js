import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'
import Header from './Components/Header/Header'
import NavBar from './Components/NavBar/NavBar'
import List from './Pages/List/List'
import Product from './Pages/Product/Product'
import RecentList from './Pages/RecentList/RecentList'
import About from './Pages/About/About'
class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Root>
          <Container>
            <Header />
            <Switch>
              <Route exact path={['/', '/list']} component={List} />
              <Route exact path="/product/:index" component={Product} />
              <Route exact path="/recentList" component={RecentList} />
              <Route exact path="/about" component={About} />
            </Switch>
            <NavBar />
          </Container>
        </Root>
      </Router>
    )
  }
}

export default Routes

const Root = styled.div`
  display: flex;
  justify-content: center;
  background: #c0c0c0;
  min-height: 100vh;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  width: 768px;
  padding-bottom: 75px;
`
