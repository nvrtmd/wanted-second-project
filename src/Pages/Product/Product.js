import React from 'react'
import styled from 'styled-components'
import Item from 'Components/Item/Item'
import SaveDataToLocalStorage from 'utils/SaveDataToLocalStorage'
import GetDataFromLocalStorage from 'utils/GetDataFromLocalStorage'
import MoveAfterVisit from 'utils/MoveAfterVisit'
import {
  PRODUCT_LIST,
  NUM_OF_VISITABLE_PRODUCT,
  INTERESTED,
  PRODUCT_CNT_LIMIT,
  ALERT_NO_MORE_RANDOM_PRODUCT,
  ALERT_NO_MORE_RANDOM_PRODUCT_EXCEPT_CURRENT,
} from 'constant'
import { PRODUCT_URL } from 'config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'

class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = { wholeProducts: PRODUCT_LIST, products: [] }
    this.addDislikeProduct = this.addDislikeProduct.bind(this)
    this.getRandomProduct = this.getRandomProduct.bind(this)
  }

  componentDidMount() {
    if (
      // NUM_OF_VISITABLE_PRODUCT (방문 가능한 상품의 수를 값으로 가지는 key)
      // INTERESTED (관심 있는 상품의 수 === 관심 없음 처리되지 않은 상품의 수)
      // 만약 저 두 key:value 쌍이 LocalStorage에 존재하지 않으면,
      // LocalStorage에 해당 데이터 쌍 저장
      !GetDataFromLocalStorage(NUM_OF_VISITABLE_PRODUCT) &&
      !GetDataFromLocalStorage(INTERESTED)
    ) {
      SaveDataToLocalStorage(NUM_OF_VISITABLE_PRODUCT, PRODUCT_CNT_LIMIT)
      SaveDataToLocalStorage(INTERESTED, PRODUCT_CNT_LIMIT)
    }
  }

  genRandomNumber() {
    const num = Math.floor(Math.random() * PRODUCT_CNT_LIMIT)
    return num
  }

  addDislikeProduct(index) {
    // LocalStorage에서 키가 interested인 값을 가져와서 변수에 할당
    let interested = GetDataFromLocalStorage('interested')
    let data = []
    // data에 조회한 상품 목록을 할당
    data = GetDataFromLocalStorage('watched') || []
    // 조회 상품 목록 순회
    for (let i = 0; i < data.length; i++) {
      if (data[i].index === index && data[i].interest) {
        // 만약 조회 상품 목록에서
        // index가 관심 없음 처리한 상품의 index와 일치하고, interest가 true인 상품 발견하면
        data[i].interest = false
        // 해당 상품의 interest를 false로 처리 후 LocalStorage에 저장
        // 반복문 탈출
        SaveDataToLocalStorage('watched', data)
        break
      }
    }
    if (interested === 1) {
      // interested가 1이면?
      // 즉, 모든 상품이 다 관심 없음 처리 되고
      // 관심있는 상품이 단 하나만 남아있으면
      // 모든 상품이 관심 없음 처리 되었음을 알리며 main 화면으로 이동시킴
      alert(ALERT_NO_MORE_RANDOM_PRODUCT)
      this.props.history.push({
        pathname: `/`,
      })
      return
    }

    // interested(관심 없음 처리되지 않은 상품의 수)에서 1을 뺀 뒤 LocalStorage에 저장
    SaveDataToLocalStorage('interested', interested - 1)
    // random으로 상품 가져오는 함수 실행
    this.getRandomProduct()
  }

  getRandomProduct() {
    let numOfVisitableProduct = GetDataFromLocalStorage('numOfVisitableProduct')
    let interested = GetDataFromLocalStorage('interested')

    // 만약 방문할 수 있는 상품의 수가 1개 이하라면
    // random load 못하도록 message로 알린 후 return
    if (numOfVisitableProduct <= 1) {
      alert(ALERT_NO_MORE_RANDOM_PRODUCT_EXCEPT_CURRENT)
      return
    }
    // 방문 가능한 상품의 수(key)에 관심 있는 상품의 수(value)를 할당 후 LocalStorage에 저장
    SaveDataToLocalStorage('numOfVisitableProduct', interested)
    let data = []
    data = GetDataFromLocalStorage('watched') || []

    // 관심 있는 상품의 수가 1개 이상이면 반복
    outer: while (interested >= 1) {
      const randomNum = this.genRandomNumber()
      for (let i = 0; i < data.length; i++) {
        if (data[i].index === randomNum) {
          // 만약 조회 상품 목록에서 randomNum과 상품의 index 값이 같은 상품을 발견하면
          if (data[i].interest === false) {
            // randomNum을 index로 가지는 상품의 조회 내역 존재하며, 관심 없음 처리된 상품이라면
            // outer 반복문 다시 실행 (randomNum 생성부터 다시)
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
