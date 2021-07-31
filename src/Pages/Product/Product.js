import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'
import SaveDataToLocalStorage from '../../utils/SaveDataToLocalStorage'
import GetDataFromLocalStorage from '../../utils/GetDataFromLocalStorage'
import MoveAfterVisit from '../../utils/MoveAfterVisit'

const LIMIT = 100

class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = { wholeProducts: [], products: [] }
    this.addDislikeProduct = this.addDislikeProduct.bind(this)
    this.getRandomProduct = this.getRandomProduct.bind(this)
  }

  componentDidMount() {
    fetch('http://localhost:3000/Data/data.json')
      .then((response) => response.json())
      .then((response) => {
        this.setState({ wholeProducts: response })
      })

    if (
      !GetDataFromLocalStorage('numOfVisitableProduct') &&
      !GetDataFromLocalStorage('interested')
    ) {
      SaveDataToLocalStorage('numOfVisitableProduct', LIMIT)
      SaveDataToLocalStorage('interested', LIMIT)
    }
  }

  genRandomNumber() {
    const num = Math.floor(Math.random() * LIMIT)
    return num
  }

  addDislikeProduct(index) {
    let interested = GetDataFromLocalStorage('interested')
    let data = []
    data = GetDataFromLocalStorage('watched') || []
    for (let i = 0; i < data.length; i++) {
      if (data[i].index === index && data[i].interest) {
        data[i].interest = false
        SaveDataToLocalStorage('watched', data)
        break
      }
    }
    if (interested === 1) {
      alert(`모든 상품이 '관심없음' 처리 되어 있습니다.`)
      this.props.history.push({
        pathname: `/`,
      })
      return
    }
    SaveDataToLocalStorage('interested', interested - 1)
    this.getRandomProduct()
  }

  getRandomProduct() {
    let numOfVisitableProduct = GetDataFromLocalStorage('numOfVisitableProduct')
    let interested = GetDataFromLocalStorage('interested')

    if (numOfVisitableProduct <= 1) {
      alert(`해당 상품 외 모든 상품이 '관심 없는 상품'입니다.`)
      return
    }
    SaveDataToLocalStorage('numOfVisitableProduct', interested)
    let data = []
    data = GetDataFromLocalStorage('watched') || []

    outer: while (interested >= 1) {
      const randomNum = this.genRandomNumber()
      for (let i = 0; i < data.length; i++) {
        if (data[i].index === randomNum) {
          if (data[i].interest === false) {
            // randomNum을 index로 가지는 상품의 조회 내역 존재하며, 관심 없음 처리된 상품
            continue outer
          } else if (
            data[i].interest &&
            randomNum.toString() !== this.props.match.params.index
          ) {
            // randomNum을 index로 가지는 상품의 조회 내역 존재하며
            // 관심 없음 처리되지 않은 경우 && randomNum이 현재 페이지 상품의 index와 다를 경우
            // 해당 상품 방문 기록에서 date만 현재 시간으로 갱신해서 LocalStorage에 재삽입
            // 해당 상품 상세 페이지로 방문
            const newDate = new Date()
            data[i].date = newDate
            MoveAfterVisit(data, `/product/${randomNum}`, this.props)
            return
          } else {
            // randomNum을 index로 가지는 상품의 조회 내역 존재하며
            // 관심 없음 처리되지 않은 경우
            // 그러나 randomNum이 현재 페이지 상품의 index와 같은 경우
            continue outer
          }
        }
      }
      // randomNum을 index로 가지는 상품의 조회 내역 존재하지 않는 경우
      // 해당 index의 상품 정보를 wholeProducts data로부터 검색 후 가져와서 parsing(index, date, interest 정보 추가)
      // LocalStorage에 parsing된 상품 정보 추가 후 해당 상품 상세 페이지로 방문
      const newProduct = this.state.wholeProducts[randomNum]
      const date = new Date()
      const tempObj = { index: randomNum, date: date, interest: true }
      const product = Object.assign(tempObj, newProduct)
      data.push(product)
      MoveAfterVisit(data, `/product/${randomNum}`, this.props)
      return
    }
  }

  render() {
    const { params } = this.props.match
    return (
      <>
        <PageTitle>상세 상품 페이지</PageTitle>
        {this.state.wholeProducts.map((product, index) => {
          return index === Number.parseInt(params.index) ? (
            <div key={index}>
              <ProductContainer>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductBrand>{product.brand}</ProductBrand>
                <Wrapper>
                  <Price>{product.price} 원</Price>
                  <Random
                    onClick={() => {
                      this.getRandomProduct(product, index)
                    }}
                  >
                    <FontAwesomeIcon icon={faRandom} />
                  </Random>
                  <Dislike
                    onClick={() => {
                      this.addDislikeProduct(product, index)
                    }}
                  >
                    관심 없어요
                  </Dislike>
                </Wrapper>
              </ProductContainer>
            </div>
          ) : (
            <span key={index}></span>
          )
        })}
      </>
    )
  }
}
const PageTitle = styled.div`
  margin-top: 30px;
  margin-left: 68px;
  font-size: 36px;
  font-weight: bold;
`
const ProductContainer = styled.div`
  width: 630px;
  margin: 0 auto;
  margin-top: calc((100vh - 300px) / 4);
  padding: 52px 34px;
  border: 4px solid #2d3ff3;
  border-radius: 15px;
`
const ProductTitle = styled.div`
  font-size: 32px;
  font-weight: bold;
`
const ProductBrand = styled.div`
  margin-top: 6px;
  font-size: 26px;
  color: #696969;
`
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 21px;
`
const Price = styled.div`
  font-size: 30px;
`
const Random = styled.button`
  color: #2d3ff3;
  font-size: 30px;
  margin-left: 160px;
`
const Dislike = styled.button`
  width: 175px;
  padding: 8px;
  background-color: #2d3ff3;
  color: white;
  font-size: 26px;
  border-radius: 15px;
`
export default Product
