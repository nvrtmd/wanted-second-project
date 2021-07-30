import React from 'react'
import styled from 'styled-components'
import Header from 'Components/Header/Header'
import NavBar from 'Components/NavBar/NavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'

class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = { products: [] }
  }

  addDislikeProduct(index) {
    console.log(`add ${index} dislike`)
  }

  getRandomProduct() {
    console.log('get Random Product')
  }

  componentDidMount() {
    // this.getRandomProduct()
  }

  render() {
    const { params } = this.props.match
    console.log(params.index)
    return (
      <Container>
        <Header />
        <PageTitle>상세 상품 페이지</PageTitle>
        <ProductContainer>
          <ProductTitle>중고 스톤아일랜드 쉐도우와팬 봄니트 95</ProductTitle>
          <ProductBrand>스톤아일랜드</ProductBrand>
          <Wrapper>
            <Price>350,000 원</Price>
            <Random onClick={this.addDislikeProduct}>
              <FontAwesomeIcon icon={faRandom} />
            </Random>
            <Dislike onClick={this.addDislikeProduct.bind(this, params.index)}>
              관심 없어요
            </Dislike>
          </Wrapper>
        </ProductContainer>
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
