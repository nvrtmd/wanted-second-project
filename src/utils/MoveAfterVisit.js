import SaveDataToLocalStorage from './SaveDataToLocalStorage'

const MoveAfterVisit = (visitProductData, moveTo, prevPage) => {
  //조회할 product 방문 처리 (LocalStorage에 조회할 product 정보 삽입 또는 갱신)
  SaveDataToLocalStorage('watched', visitProductData)
  //조회할 product detail page로 이동
  return prevPage.history.push(`${moveTo}`)
}
export default MoveAfterVisit
