import React from 'react'
import styled from 'styled-components'
import Header from '../../Components/Header/Header'
import NavBar from '../../Components/NavBar/NavBar'
import Item from '../../Components/Item/Item'
import { Link } from 'react-router-dom'

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
      <>
        <Header />
        <Products>
          {this.state.products.map((product, index) => {
            return (
              <Link
                to={`/product/${index}`}
                onClick={() => {
                  console.log(index)
                }}
              >
                <Item
                  key={index}
                  item={{
                    title: product.title,
                    brand: product.brand,
                    price: product.price,
                  }}
                />
              </Link>
            )
          })}
        </Products>
        <NavBar />
      </>
    )
  }
}

export default List
