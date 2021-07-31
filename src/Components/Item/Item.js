import React from 'react'
import styled from 'styled-components'

class Item extends React.Component {
  render() {
    const { title, brand, price, index } = this.props.item
    return (
      <ItemWrapper id={index}>
        <ItemTitle>{title}</ItemTitle>
        <ItemDetail>
          <span>{brand}</span>
          <span>{price}원</span>
        </ItemDetail>
      </ItemWrapper>
    )
  }
}

export default Item

const ItemWrapper = styled.li`
  margin: 36px 0;
  padding: 34px;
  width: 100%;
  min-width: 630px;
  border: 5px solid #2d3ff3;
  border-radius: 15px;
  background: #ffffff;

  :hover {
    cursor: pointer;
  }
`

const ItemTitle = styled.h2`
  color: #000000;
  font-family: Roboto;
  font-size: 29px;
  font-weight: bold;
`
const ItemDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span:nth-child(1) {
    color: #707070;
    font-size: 24px;
  }

  span:nth-child(2) {
    color: #000000;
    font-size: 26px;
  }
`
