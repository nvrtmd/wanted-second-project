import React from 'react'
import styled from 'styled-components'
import Header from '../../Components/Header/Header'
import NavBar from '../../Components/NavBar/NavBar'
import Item from '../../Components/Item/Item'

const Root = styled.div`
  display: flex;
  justify-content: center;
  background: #c0c0c0;
  min-height: 100vh;
`

const Container = styled.div`
  background: #fff;
  width: 768px;
  margin-bottom: 75px;
`

const Products = styled.div`
  width: 630px;
  margin: 0 auto;
`

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = { products: [] }
  }

  componentDidMount() {
    fetch('Data/data.json')
      .then((response) => response.json())
      .then((response) => {
        this.setState({ products: response })
      })
  }

  render() {
    return (
      <Root>
        <Container>
          <Header />
          <Products>
            {this.state.products.map((product, index) => {
              return (
                <Item
                  key={index}
                  item={{
                    title: product.title,
                    brand: product.brand,
                    price: product.price,
                  }}
                />
              )
            })}
          </Products>
          <NavBar />
        </Container>
      </Root>
    )
  }
}

export default List
