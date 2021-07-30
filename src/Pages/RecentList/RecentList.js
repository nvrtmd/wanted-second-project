import React from 'react'
import styled from 'styled-components'
import Item from '../../Components/Item/Item'
import { ReactComponent as SortImage } from '../../SvgImages/sort.svg'

class RecentList extends React.Component {
  constructor() {
    super()

    this.state = {
      items: [],
      selectedBrands: [],
    }
  }

  componentDidMount() {
    this.requestData()
  }

  requestData = async () => {
    const response = await fetch('/Data/data.json')
    const itemData = await response.json()

    this.setState({
      items: itemData,
    })
  }

  selectBrand = ({ target: { value } }) => {
    const { selectedBrands } = this.state
    if (selectedBrands.includes(value)) return

    this.setState({
      selectedBrands: [...this.state.selectedBrands, value],
    })
  }

  render() {
    const { items, selectedBrands } = this.state
    const menuLists = [...new Set(items.map((item) => item.brand))]
    console.log(selectedBrands)
    return (
      <RecentListWrapper>
        <Title>
          <h2>최근 조회한 상품</h2>
        </Title>
        <BrandFilter>
          <BrandMenu name="menus" onChange={this.selectBrand}>
            <option>BRAND</option>
            {menuLists.map((menu, index) => (
              <option key={index} value={menu}>
                {menu}
              </option>
            ))}
          </BrandMenu>
          <SelectedBrand>
            {selectedBrands?.map((selectedBrand) => (
              <Brand>
                <span>{selectedBrand}</span>
              </Brand>
            ))}
          </SelectedBrand>
        </BrandFilter>
        <DateFilter>
          <SortImage />
          <select>
            <option>최근 조회순</option>
            <option>낮은 가격순</option>
          </select>
        </DateFilter>
        <LikeFilter>
          <span>관심 없는 상품 숨기기</span>
          <input type="checkbox" />
        </LikeFilter>
        <ItemContainer>
          <Item item={{ title: 'hihi', brand: 'fe', price: 20000 }} />
        </ItemContainer>
      </RecentListWrapper>
    )
  }
}

export default RecentList

const RecentListWrapper = styled.div`
  width: 100%;
  padding: 0 55px;
`

const Title = styled.div`
  margin: 30px 0;

  h2 {
    color: #000000;
    font-size: 36px;
    font-weight: bold;
  }
`

const BrandFilter = styled.div`
  display: flex;
  margin-bottom: 30px;
`

const BrandMenu = styled.select`
  margin-right: auto;
  height: 37px;
  background: rgba(255, 255, 255, 0.16);
  border: 5px solid #2d3ff3;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
`

const SelectedBrand = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 80%;
`

const Brand = styled.div`
  margin: 0 0 10px 10px;
  padding: 7px;
  color: #000000;
  background: rgba(255, 255, 255, 0.16);
  border: 3px solid #2d3ff3;
  box-sizing: border-box;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
  line-height: 20px;
`

const DateFilter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;

  svg {
    margin-right: 5px;
  }

  select {
    border: none;
    color: #919191;
    font-size: 20px;
    font-weight: bold;
  }
`

const LikeFilter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  span {
    color: #919191;
    font-size: 20px;
    font-weight: bold;
  }

  input {
    margin-left: 10px;
    width: 20px;
    height: 20px;
  }
`

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
