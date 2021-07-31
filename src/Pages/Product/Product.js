import React from 'react'
import styled from 'styled-components'
import Item from 'Components/Item/Item'
import SaveDataToLocalStorage from 'utils/SaveDataToLocalStorage'
import GetDataFromLocalStorage from 'utils/GetDataFromLocalStorage'
import MoveAfterVisit from 'utils/MoveAfterVisit'
import {
  FETCH_ERROR_MESSAGE,
  NUM_OF_VISITABLE_PRODUCT,
  INTERESTED,
  PRODUCT_CNT_LIMIT,
  ALERT_NO_MORE_RANDOM_PRODUCT,
  ALERT_NO_MORE_RANDOM_PRODUCT_EXCEPT_CURRENT,
} from 'constant'
import { BASE_URL, PRODUCT_URL } from 'config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'

class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = { wholeProducts: [], products: [] }
    this.addDislikeProduct = this.addDislikeProduct.bind(this)
    this.getRandomProduct = this.getRandomProduct.bind(this)
  }

  componentDidMount() {
    fetch(BASE_URL)
      .then((response) => response.json())
      .then((response) => {
        this.setState({ wholeProducts: response })
      })
      .catch(() => {
        console.log(FETCH_ERROR_MESSAGE)
      })

    if (
      !GetDataFromLocalStorage(NUM_OF_VISITABLE_PRODUCT) &&
      !GetDataFromLocalStorage(INTERESTED)
    ) {
      SaveDataToLocalStorage(NUM_OF_VISITABLE_PRODUCT, PRODUCT_CNT_LIMIT)
      SaveDataToLocalStorage(INTERESTED, PRODUCT_CNT_LIMIT)
    }
  } //componentDidMount

  genRandomNumber() {
    const num = Math.floor(Math.random() * PRODUCT_CNT_LIMIT)
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
      alert(ALERT_NO_MORE_RANDOM_PRODUCT)
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
      alert(ALERT_NO_MORE_RANDOM_PRODUCT_EXCEPT_CURRENT)
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
            MoveAfterVisit(data, `${PRODUCT_URL}/${randomNum}`, this.props)
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
      MoveAfterVisit(data, `${PRODUCT_URL}/${randomNum}`, this.props)
      return
    }
  }

  render() {
    const { params } = this.props.match
    return (
      <>
        <PageTitle>상세 상품 페이지</PageTitle>
        <ProductsList>
          {this.state.wholeProducts.map((product, index) => {
            return index === Number.parseInt(params.index) ? (
              <div key={index}>
                <Item
                  item={{
                    title: product.title,
                    brand: product.brand,
                    price: product.price,
                  }}
                />
                <ButtonContainer>
                  <Random
                    onClick={() => {
                      this.getRandomProduct()
                    }}
                  >
                    <FontAwesomeIcon icon={faRandom} />
                  </Random>
                  <Dislike
                    onClick={() => {
                      this.addDislikeProduct(index)
                    }}
                  >
                    관심 없어요
                  </Dislike>
                </ButtonContainer>
              </div>
            ) : (
              <span key={index}></span>
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

const ProductsList = styled.div`
  margin: calc((100vh - 300px) / 4) 69px;
`

const Random = styled.button`
  color: #2d3ff3;
  font-size: 60px;
`

const Dislike = styled.button`
  width: 180px;
  padding: 15px;
  background-color: #2d3ff3;
  color: white;
  font-size: 27px;
  border-radius: 15px;
`

export default Product
