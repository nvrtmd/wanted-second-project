import React from 'react'
import styled from 'styled-components'
import Item from '../../Components/Item/Item'
import SaveDataToLocalStorage from '../../utils/SaveDataToLocalStorage'
import GetDataFromLocalStorage from '../../utils/GetDataFromLocalStorage'

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
      .catch(() => {
        console.log('error!')
      })
  }

  handleClick(product) {
    let data = []
    // data = JSON.parse(localStorage.getItem('watched')) || []
    data = GetDataFromLocalStorage('watched') || []
    if (data) {
      // localstorage가 비어 있지 않으면 localstorage data 순회
      for (let i = 0; i < data.length; i++) {
        if (data[i].index === product.index) {
          // 이미 한 번 조회한 이력이 존재하는 상품이라면
          if (data[i].interest === false) {
            // '관심 없음' 상품이라면 alert
            alert('관심 없는 상품입니다.')
            return
          } else {
            // '관심 없음' 상품이 아니라면 조회 시간 및 날짜 갱신
            // 상세 페이지로 이동
            console.log('갱신')
            data[i].date = product.date
            SaveDataToLocalStorage('watched', data)
            this.props.history.push({
              pathname: `/product/${product.index}`,
              state: { product },
            })
            return
          }
        }
      }
      // 조회 이력이 없는 상품이라면
      // 해당 상품 정보 localstorage에 저장 및 상세 페이지로 이동
      console.log('조회이력없음')
      data.push(product)
      SaveDataToLocalStorage('watched', data)
      this.props.history.push({
        pathname: `/product/${product.index}`,
        state: { product },
      })
      return
    }
    // localstorage 비어있다면
    // 클릭한 상품 정보 localstorage에 저장 및 상세 페이지로 이동 (index 및 날짜 정보 추가해서)
    data.push(product)
    SaveDataToLocalStorage('watched', data)
    this.props.history.push({
      pathname: `/product/${product.index}`,
      state: { product },
    })
  }

  render() {
    console.log(this.state.products)
    return (
      <>
        <div
          onClick={() => {
            localStorage.clear()
          }}
        >
          초기화
        </div>
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

export default List

const ProductsList = styled.div`
  width: 630px;
  margin: 0 auto;
`
const Product = styled.div`
  cursor: pointer;
`
