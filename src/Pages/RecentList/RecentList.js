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
    // 상품 조회 목록(배열)을 itemData에 저장한 뒤,
    // items state에 할당
    const itemData = GetDataFromLocalStorage(WATCHED)

    this.setState({
      items: itemData,
    })
  }

  selectBrand = ({ target: { value } }) => {
    // { target: { value } } event.target.value의 값을 value라는 이름으로 사용
    const { selectedBrands } = this.state
    // object destructuring의 일종, state 중 selectedBrands를
    // this.state.selectedBrands로 쓰지 않고, 그냥 selectedBrands로 쓸 수 있게
    // this.state.selectedBrands를 변수 selectedBrands에 할당한 것
    console.log(selectedBrands)
    console.log(value)
    // 현재 선택한 항목이 'BRAND'인 경우(브랜드 선택하지 않은 경우) return
    if (value === 'BRAND') return
    // 현재 선택한 항목이 이미 '선택 된 브랜드 목록'에 존재한다면 return
    if (selectedBrands.includes(value)) return

    // 현재 선택한 항목이 '선택 된 브랜드 목록'에 존재하지 않는다면
    // selectedBrands에 value(현재 선택한 항목) 추가하여 저장
    this.setState({
      selectedBrands: [...this.state.selectedBrands, value],
    })
  }

  deleteSelectedBrand = ({ target: { name } }) => {
    const { selectedBrands } = this.state

    // 선택된 브랜드를 삭제하면 현재 삭제한 브랜드(name)가 아닌 브랜드들만 남겨서 재할당
    this.setState(
      {
        selectedBrands: selectedBrands.filter((brand) => brand !== name),
      },
      () => {
        // 선택된 브랜드의 갯수가 하나라도 남아 있다면
        // this.optionRef.current == <option ref={this.optionRef} value="BRAND">
        // 해당 element(value가 BRAND인 option)의 selected 상태를 true로
        // 즉, select 칸에 디폴트값인 BRAND가 나오도록
        // 아래 조건문이 없으면?
        // 선택된 브랜드 다 삭제해도 마지막에 남아있던 브랜드가 select 칸에 남아 있게됨
        if (!this.state.selectedBrands.length) {
          const option = this.optionRef.current
          option.selected = true
        }
      }
    )
  }

  selectSorting = ({ target: { value } }) => {
    // 어떻게 조회할 건지 선택하면
    // 해당 조건으로 selectedSorting을 갱신
    // 최근 조회순 / 낮은 가격순 두 개의 옵션 중 하나로
    this.setState({
      selectedSorting: value,
    })
  }

  selectHiding = () => {
    // 관심 없는 상품 숨기기 체크 박스 클릭 시
    // isSelectedHiding 상태를 바꿈
    // true 였으면 false로, false 였으면 true로
    const { isSelectedHiding } = this.state
    this.setState({
      isSelectedHiding: !isSelectedHiding,
    })
  }

  getClickedItem = (target) => {
    // click한 node의 id, 즉 product의 index를 index라는 변수에 할당
    const idArr = []
    const index = getClickedNodeId(target, idArr)

    // index가 없으면? return
    if (!index) return

    // items, 즉, 상품 조회 목록(배열)에서
    // index의 첫번째 요소와 상품 정보 내의 index가 같은 상품을 찾아서 return
    // selectedItem 변수에 해당 상품 정보를 저장 후 return
    const { items } = this.state
    const selectedItem = items.find((item) => item.index === index[0])
    return selectedItem
  }

  moveToProductPage = ({ target }) => {
    const { history } = this.props
    // selectedItem 변수에 클릭한 상품의 상품 정보 할당
    const selectedItem = this.getClickedItem(target)

    // 상품 정보 존재하지 않으면 return
    if (!selectedItem) return

    // 상품 정보 내 interest가 false이면
    // 관심 없는 상품 message 띄워준 뒤 return
    if (!selectedItem.interest) {
      alert(ALERT_NOT_INTERESTING_PRODUCT)
      return
    }

    // 관심 없는 상품이 아닐 경우
    // 해당 상품 상세 페이지로 이동
    history.push({
      pathname: `${PRODUCT_URL}/${selectedItem.index}`,
      state: selectedItem,
    })
  }

  render() {
    const { items, selectedBrands, selectedSorting, isSelectedHiding } =
      this.state

    // items(상품 조회 목록) 내의 brand들을 다 모은 후
    // Set로 만들어 중복 제거, menuLists에 할당
    // 나이키 한 칸, 구찌 한 칸 이렇게 나와야 하는데
    // ... 없으면 나이키구찌 이렇게 나옴
    const menuLists = [...new Set(items?.map((item) => item.brand))]
    // 상품의 brand가 선택된 브랜드 목록에 포함된다면
    // 해당 상품들을 selectedItems에 할당
    const selectedItems = items?.filter((item) =>
      selectedBrands.includes(item.brand)
    )
    // 최근 조회순으로 조회하기 선택하면
    // 상품이 조회된 날짜,시간을 기준으로 sort
    // 그렇지 않으면 낮은 가격순으로 sort
    const sortCallBack = (item1, item2) => {
      if (selectedSorting === RECENT_ORDER) {
        if (item1.date > item2.date) {
          return -1
        }
      } else {
        return item1.price - item2.price
      }
    }

    // (브랜드로)선택된 상품들이 최소 한 개라도 있으면
    // 그 상품들을 sortCallBack의 논리에 맞게 sort 후 sortedItems에 할당
    // 브랜드로 선택된 상품들이 없다면
    // 그냥 상품 조회 목록을 sortCallBack의 논리에 맞게 sort 후 sortedItems에 할당
    const sortedItems =
      selectedItems?.length > 0
        ? selectedItems.sort(sortCallBack)
        : items?.sort(sortCallBack)

    console.log(sortedItems)
    return items ? (
      <RecentListWrapper>
        <Title>
          <h2>최근 조회한 상품</h2>
        </Title>
        <BrandFilter>
          <BrandMenu name="menus" onChange={this.selectBrand}>
            <option ref={this.optionRef} value="BRAND">
              BRAND
            </option>
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

  // 만약 target의 class 목록에 'itemContainer'가 있다면
  // 즉, 상품 정보가 담긴 Item 컴포넌트가 아닌
  // 그것을 감싸고 있는, Item들이 감긴 itemContainer이 click 됐다면
  // false를 return
  if (target.classList.contains(limitNodeClassName)) {
    return false
  }

  // target의 class 목록에 'itemContainer'가 없고
  // nodeName이 'LI'라면 (Item 컴포넌트가 li 태그로 만들어짐)
  // 즉, Item을 클릭했다면
  // idArr에 target의 id를 숫자화하여 push한 뒤 return
  // (Item 컴포넌트의 id에는 해당 상품의 index가 할당되어 있음)
  if (target.nodeName === 'LI') {
    idArr.push(Number(target.id))
    return idArr
  }

  // getClickedNodeId에 target의 부모 node와 idArr를 parameter로 하여 실행
  // Item 내의 어떤 요소를 클릭했을 땐, 강제로 이벤트 버블링을 일으키기 위해?
  // 즉, 상위 요소에게 이벤트 위임하기 위해?
  // 왜냐, Item에서 이벤트가 일어나야 하기 때문
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
