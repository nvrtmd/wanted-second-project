import React from 'react'
import styled from 'styled-components'
import Item from 'Components/Item/Item'
import GetDataFromLocalStorage from 'utils/GetDataFromLocalStorage'
import MoveAfterVisit from 'utils/MoveAfterVisit'
import { FETCH_ERROR_MESSAGE, NOT_INTERESTED_MESSAGE } from 'constant'
import { BASE_URL } from 'config'

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = { products: [] }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    fetch(BASE_URL)
      .then((response) => response.json())
      .then((response) => {
        this.setState({ products: response })
      })
      .catch(() => {
        console.log(FETCH_ERROR_MESSAGE)
      })
  }

  handleClick(product) {
    let data = []
    data = GetDataFromLocalStorage('watched') || []
    if (data) {
      // 상품 조회 이력이 존재한다면
      for (let i = 0; i < data.length; i++) {
        if (data[i].index === product.index) {
          // 이미 한 번 조회한 이력이 존재하는 상품이라면
          if (data[i].interest === false) {
            // '관심 없음' 상품이라면 alert
            alert(NOT_INTERESTED_MESSAGE)
            return
          } else {
            // '관심 없음' 상품이 아니라면 조회 시간 및 날짜 갱신
            // 상세 페이지로 이동
            data[i].date = product.date
            MoveAfterVisit(data, `/product/${product.index}`, this.props)
            return
          }
        }
      }
      // 조회 이력이 없는 상품이라면
      // 해당 상품 정보 LocalStorage에 저장(조회 처리) 및 상세 페이지로 이동
      data.push(product)
      MoveAfterVisit(data, `/product/${product.index}`, this.props)
      return
    }
    // LocalStorage 비어있다면
    // 클릭한 상품 정보 LocalStorage에 저장(조회 처리) 및 상세 페이지로 이동 (index 및 날짜 정보 추가해서)
    data.push(product)
    MoveAfterVisit(data, `/product/${product.index}`, this.props)
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
