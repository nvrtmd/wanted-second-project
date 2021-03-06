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
            // randomNum??? index??? ????????? ????????? ?????? ?????? ????????????, ?????? ?????? ????????? ??????
            continue outer
          } else if (
            data[i].interest &&
            randomNum.toString() !== this.props.match.params.index
          ) {
            // randomNum??? index??? ????????? ????????? ?????? ?????? ????????????
            // ?????? ?????? ???????????? ?????? ?????? && randomNum??? ?????? ????????? ????????? index??? ?????? ??????
            // ?????? ?????? ?????? ???????????? date??? ?????? ???????????? ???????????? LocalStorage??? ?????????
            // ?????? ?????? ?????? ???????????? ??????
            const newDate = new Date()
            data[i].date = newDate
            MoveAfterVisit(data, `${PRODUCT_URL}/${randomNum}`, this.props)
            return
          } else {
            // randomNum??? index??? ????????? ????????? ?????? ?????? ????????????
            // ?????? ?????? ???????????? ?????? ??????
            // ????????? randomNum??? ?????? ????????? ????????? index??? ?????? ??????
            continue outer
          }
        }
      }
      // randomNum??? index??? ????????? ????????? ?????? ?????? ???????????? ?????? ??????
      // ?????? index??? ?????? ????????? wholeProducts data????????? ?????? ??? ???????????? parsing(index, date, interest ?????? ??????)
      // LocalStorage??? parsing??? ?????? ?????? ?????? ??? ?????? ?????? ?????? ???????????? ??????
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
        <PageTitle>?????? ?????? ?????????</PageTitle>
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
                    ?????? ?????????
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
