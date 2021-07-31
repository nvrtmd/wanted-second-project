import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'

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
  }

  genRandomNumber() {
    const num = Math.floor(Math.random() * LIMIT)
    return num
  }

  checkRandomNumber(num) {
    let data = []
    data = JSON.parse(localStorage.getItem('watched')) || []
    // console.log('checking ' + num)
    for (let i = 0; i < data.length; i++) {
      if (data[i].index === num) {
        if (!data[i].interest) {
          return false
        }
      }
    }
    return true
  }

  setInterest(num) {
    // [관심없어요]버튼 클릭 시 interest 를 false로 변경
    let data = []
    data = JSON.parse(localStorage.getItem('watched')) || []
    for (let i = 0; i < data.length; i++) {
      if (data[i].index === num) {
        let newProduct = {
          index: data[i].index,
          title: data[i].title,
          brand: data[i].brand,
          price: data[i].price,
          date: data[i].date,
          interest: false,
        }
        data[i] = newProduct
        localStorage.setItem('watched', JSON.stringify(data))
        break
      }
    } //for
    return false
  }

  //[관심없어요] 버튼 누를 시 동작
  addDislikeProduct(product, index) {
    // console.log(`add ${index} dislike`)
    alert('해당 상품을 앞으로 다시 보지 않습니다.')
    // 랜덤 상품으로 이동
    let interestResult = this.setInterest(index)
    this.getRandomProduct(product, index, interestResult)
  }

  //해당 상품 페이지에 방문했을 시, LS에 저장
  addWatchedLocalStorage(product, index, interestResult) {
    if (interestResult === undefined) {
      interestResult = true
    }
    let data = []
    data = JSON.parse(localStorage.getItem('watched')) || []

    for (let i = 0; i < data.length; i++) {
      if (data[i].index === index) {
        //조회 이력이 있다면
        const newDate = new Date()
        data[i].date = newDate
        data[i].interest = interestResult
        localStorage.setItem('watched', JSON.stringify(data))
        return
      } // if
    } //for
    //조회 이력이 없다면 추가
    const newDate = new Date()
    let newProduct = {
      index: index,
      title: product.title,
      brand: product.brand,
      price: product.price,
      date: newDate,
      interest: interestResult,
    }
    data.push(newProduct)
    localStorage.setItem('watched', JSON.stringify(data))
  }

  moveToOtherProduct(randomNumber) {
    let num = randomNumber
    let checkResult = this.checkRandomNumber(num)
    if (checkResult) {
      // 확인 후 이동
      this.props.history.push(`/product/${num}`)
    } else {
      let cnt = 0
      while (cnt < LIMIT + 1) {
        num = this.genRandomNumber()
        checkResult = this.checkRandomNumber(num)
        if (checkResult === true) {
          this.props.history.push(`/product/${num}`)
          return
        }
        cnt++
      }
      alert("모든 상품이 '관심없음' 처리 되어있습니다ㅠㅠ")
      this.props.history.push(`/`)
    }
  }

  // 랜덤 상품 페이지로 이동
  getRandomProduct(product, index, interestResult) {
    // 이동하기 전, watched LS에 저장하기
    this.addWatchedLocalStorage(product, index, interestResult)

    //난수 생성하여 그 index의 product로 이동
    const randomNumber = this.genRandomNumber()
    this.moveToOtherProduct(randomNumber)
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
