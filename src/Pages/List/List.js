import React from 'react'
import styled from 'styled-components'
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
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    fetch('Data/data.json')
      .then((response) => response.json())
      .then((response) => {
        this.setState({ products: response })
      })
  }

  handleClick(product) {
    console.log(product)
    let data = []
    data = JSON.parse(localStorage.getItem('watched')) || []
    console.log(data)
    data.push(product)
    localStorage.setItem('watched', JSON.stringify(data))
    // localStorage.clear()
  }

  render() {
    return (
      <>
        <Products>
          {this.state.products.map((product, index) => {
            return (
              <Link
                to={`/product/${index}`}
                onClick={() => {
                  const date = new Date()
                  this.handleClick({
                    index: index,
                    title: product.title,
                    brand: product.brand,
                    price: product.price,
                    date: date,
                    interest: true,
                  })
                }}
                key={index}
              >
                <Item
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
      </>
    )
  }
}

export default List
