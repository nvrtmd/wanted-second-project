import React from 'react'
import styled from 'styled-components'
import Item from 'Components/Item/Item'
import GetDataFromLocalStorage from 'utils/GetDataFromLocalStorage'
import { ReactComponent as SortImage } from 'SvgImages/sort.svg'
import { RECENT_ORDER, ALERT_NOT_INTERESTING_PRODUCT, WATCHED } from 'constant'
import { PRODUCT_URL } from 'config'
class RecentList extends React.Component {
  constructor() {
    super()

    this.state = {
      items: [],
      selectedBrands: [],
      selectedSorting: RECENT_ORDER,
      isSelectedHiding: false,
    }

    this.optionRef = React.createRef()
  }

  componentDidMount() {
    const itemData = GetDataFromLocalStorage(WATCHED)

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

  deleteSelectedBrand = ({ target: { name } }) => {
    const { selectedBrands } = this.state

    this.setState(
      {
        selectedBrands: selectedBrands.filter((brand) => brand !== name),
      },
      () => {
        if (!this.state.selectedBrands.length) {
          const option = this.optionRef.current
          option.selected = true
        }
      }
    )
  }

  selectSorting = ({ target: { value } }) => {
    this.setState({
      selectedSorting: value,
    })
  }

  selectHiding = () => {
    const { isSelectedHiding } = this.state
    this.setState({
      isSelectedHiding: !isSelectedHiding,
    })
  }

  getClickedItem = (target) => {
    const idArr = []
    const index = getClickedNodeId(target, idArr)

    if (!index) return

    const { items } = this.state
    const selectedItem = items.find((item) => item.index === index[0])

    return selectedItem
  }

  moveToProductPage = ({ target }) => {
    const { history } = this.props
    const selectedItem = this.getClickedItem(target)

    if (!selectedItem) return

    if (!selectedItem.interest) {
      alert(ALERT_NOT_INTERESTING_PRODUCT)
      return
    }

    history.push({
      pathname: `${PRODUCT_URL}/${selectedItem.index}`,
      state: selectedItem,
    })
  }

  render() {
    const { items, selectedBrands, selectedSorting, isSelectedHiding } =
      this.state
    const menuLists = [...new Set(items?.map((item) => item.brand))]
    const selectedItems = items?.filter((item) =>
      selectedBrands.includes(item.brand)
    )
    const sortedItems =
      selectedItems?.length > 0
        ? selectedItems.sort((item1, item2) => {
            if (selectedSorting === RECENT_ORDER) {
              if (item1.date > item2.date) {
                return -1
              }
            } else {
              return item1.price - item2.price
            }
          })
        : items?.sort((item1, item2) => {
            if (selectedSorting === RECENT_ORDER) {
              if (item1.date > item2.date) {
                return -1
              }
            } else {
              return item1.price - item2.price
            }
          })

    return items ? (
      <RecentListWrapper>
        <Title>
          <h2>최근 조회한 상품</h2>
        </Title>
        <BrandFilter>
          <BrandMenu name="menus" onChange={this.selectBrand}>
            <option ref={this.optionRef}>BRAND</option>
            {menuLists.map((menu) => (
              <option key={menu} value={menu}>
                {menu}
              </option>
            ))}
          </BrandMenu>
          <SelectedBrand>
            {selectedBrands?.map((selectedBrand) => (
              <Brand key={selectedBrand}>
                <span>{selectedBrand}</span>
                <button name={selectedBrand} onClick={this.deleteSelectedBrand}>
                  x
                </button>
              </Brand>
            ))}
          </SelectedBrand>
        </BrandFilter>
        <DateFilter>
          <SortImage />
          <select onChange={this.selectSorting}>
            <option>최근 조회순</option>
            <option>낮은 가격순</option>
          </select>
        </DateFilter>
        <LikeFilter>
          <span>관심 없는 상품 숨기기</span>
          <input type="checkbox" onChange={this.selectHiding} />
        </LikeFilter>
        <ItemContainer
          onClick={this.moveToProductPage}
          className="itemContainer"
        >
          {isSelectedHiding
            ? sortedItems
                .filter((item) => item.interest)
                .map((item) => <Item key={item.index} item={item} />)
            : sortedItems.map((item) => <Item key={item.index} item={item} />)}
        </ItemContainer>
      </RecentListWrapper>
    ) : (
      <EmptyScreen>
        <h1>조회한 상품이 존재하지 않습니다.</h1>
      </EmptyScreen>
    )
  }
}

export default RecentList

function getClickedNodeId(target, idArr) {
  const limitNodeClassName = 'itemContainer'

  if (target.classList.contains(limitNodeClassName)) {
    return false
  }

  if (target.nodeName === 'LI') {
    idArr.push(Number(target.id))
    return idArr
  }

  getClickedNodeId(target.parentNode, idArr)
  return idArr
}

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

  button {
    margin-left: 5px;
    font-size: 30px;
    line-height: 20px;

    :hover {
      color: #2d3ff3;
    }
  }
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
const EmptyScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  h1 {
    font-size: 40px;
    font-weight: bold;
  }
`
