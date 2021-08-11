import React from 'react'
import styled from 'styled-components'

import GetDataFromLocalStorage from 'utils/GetDataFromLocalStorage'
import MoveAfterPush from 'utils/MoveAfterPush'

import Item from 'Components/Item/Item'
import { PRODUCT_LIST, ALERT_NOT_INTERESTING_PRODUCT, WATCHED } from 'constant'

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: PRODUCT_LIST,
      histories: GetDataFromLocalStorage(WATCHED),
    }
    this.handleClick = this.handleClick.bind(this)
  }

  isWatched(product) {
    const watchedProduct =
      this.state.histories?.find(
        (history) => history.index === product.index
      ) || null
    return watchedProduct
  }

  deleteHistory(product) {
    const newWatchedHistory = this.state.histories.filter((history) => {
      return history !== product
    })
    console.log(newWatchedHistory)
    return newWatchedHistory
  }

  MoveAfterAddToWatched(history, product, idx) {
    history.push(product)
    MoveAfterPush(history, `/product/${idx}`, this.props)
  }

  handleClick(product) {
    const watchedProduct = this.isWatched(product)

    if (!watchedProduct) {
      this.MoveAfterAddToWatched(this.state.histories, product, product.index)
      return
    }
    if (watchedProduct?.interest) {
      const newWatchedHistory = this.deleteHistory(watchedProduct)
      this.MoveAfterAddToWatched(newWatchedHistory, product, product.index)
      return
    } else {
      alert(ALERT_NOT_INTERESTING_PRODUCT)
      return
    }
  }

  render() {
    return (
      <>
        <PageTitle>전체 상품 목록</PageTitle>
        <ProductsList>
          {this.state.products.map((product, index) => {
            return (
              <Product
                key={index}
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
              >
                <Item
                  item={{
                    title: product.title,
                    brand: product.brand,
                    price: product.price,
                  }}
                />
              </Product>
            )
          })}
        </ProductsList>
      </>
    )
  }
}

const PageTitle = styled.div`
  margin-top: 30px;
  padding-left: 68px;
  font-size: 36px;
  font-weight: bold;
  width: 100%;
`

const ProductsList = styled.div`
  width: 630px;
  margin: 0 auto;
`

const Product = styled.div`
  cursor: pointer;
`

export default List
