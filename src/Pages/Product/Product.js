import React from 'react'
import styled from 'styled-components'
import Header from 'Components/Header/Header'
import NavBar from 'Components/NavBar/NavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'
class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = { wholeProducts: [], product: [] }
    this.addDislikeProduct = this.addDislikeProduct.bind(this)
    this.getRandomProduct = this.getRandomProduct.bind(this)
  }
  componentDidMount() {
    fetch('http://localhost:3000/Data/data.json')
      .then((response) => response.json())
      .then((response) => {
        this.setState({ wholeProducts: response })
      })
      .catch((e) => {
        console.log('error!')
        console.log(e)
      })
  }

  genRandomNumber() {
    const num = Math.floor(Math.random() * 101)
    return num
  }
  checkRandomNumber(num) {
    let result = true
    let data = []
    data = JSON.parse(localStorage.getItem('watched')) || []
    console.log('checking ' + num)
    for (let i = 0; i < data.length; i++) {
      if (data[i].index === num) {
        if (!data[i].interest) {
          //관심 없는 경우
          result = false
        }
      }
    }
    return result
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
      }
    }
  }

  //[관심없어요] 버튼 누를 시 동작
  addDislikeProduct(index) {
    console.log(`add ${index} dislike`)
    // interest false로 변경
    this.setInterest(index)
    // 랜덤 상품으로 이동
    alert('해당 상품을 앞으로 다시 보지 않습니다.')
    this.getRandomProduct()
  }

  getRandomProduct() {
    console.log('get Random Product')
    // 난수 생성하기
    const randomNumber = this.genRandomNumber()
    //생성된 난수가 not interest인지 확인
    if (this.checkRandomNumber(randomNumber)) {
      // 확인 후 이동
      // window.location.href = `/product/${randomNumber}`
      this.props.history.push(`/product/${randomNumber}`)
    }
  }

  render() {
    const { params } = this.props.match
    return (
      <Container>
        <Header />
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
                      this.getRandomProduct()
                    }}
                  >
                    <FontAwesomeIcon icon={faRandom} />
                  </Random>
                  <Dislike
                    onClick={() => {
                      this.addDislikeProduct(product.index)
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

        {/* <ProductContainer>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductBrand>{product.brand}</ProductBrand>
          <Wrapper>
            <Price>{product.price} 원</Price>
            <Random
              onClick={() => {
                this.getRandomProduct()
              }}
            >
              <FontAwesomeIcon icon={faRandom} />
            </Random>
            <Dislike
              onClick={() => {
                this.addDislikeProduct(product.index)
              }}
            >
              관심 없어요
            </Dislike>
          </Wrapper>
        </ProductContainer> */}
        <NavBar />
      </Container>
    )
  }
}
const PageTitle = styled.div`
  margin-top: 30px;
  margin-left: 68px;
  font-size: 36px;
  font-weight: bold;
`
const Container = styled.div`
  width: 768px;
  margin: 0 auto;
  background-color: white;
`
const ProductContainer = styled.div`
  width: 630px;
  margin: 0 auto;
  margin-top: 272px;
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
