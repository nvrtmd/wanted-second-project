import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import List from './Pages/List/List'
import Product from './Pages/Product/Product'
import RecentList from './Pages/RecentList/RecentList'

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path={['/', '/list']} component={List} />
          <Route exact path="/product" component={Product} />
          <Route exact path="/recentList" component={RecentList} />
        </Switch>
      </Router>
    )
  }
}

export default Routes
