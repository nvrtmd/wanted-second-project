# [Assignment 2] 미스터카멜

## 💙Basic requirements

- 사용자 선호 상품 목록 구현
- ClassComponent를 사용하여 구현
- SessionStorage 또는 LocalStorage를 사용해서 이력을 관리
- 외부 API를 사용하지 않고, Client의 리소스만 사용

<br>

## 🐥Who Did What
- 😺 백진수 : Recent Page 레이아웃 및 기능 구현, item 컴포넌트 구현
- 🐧 최혜린 : Product detail page 구축 및 기능 구현
- 🐥 민유지 : Main page 구축 및 Product detail page 기능 구현
- 🐻 문태웅 :

<br>

## 😺Built With
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/VisualStudioCode-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)

<br>

## 🐻Build Installation
```bash
# install dependencies
$ npm install
# set up firebase
$ npm install firebase
# serve with hot reload at localhost:3000
$ npm run start
```
<br>

## 🐧Project Structure
```
SRC
│  config.js
│  constant.js
│  index.js
│  Routes.js
│
├─Components
│  ├─Header
│  │      Header.js
│  │
│  ├─Item
│  │      Item.js
│  │
│  └─NavBar
│          NavBar.js
│
├─Pages
│  ├─About
│  │      About.js
│  │
│  ├─List
│  │      List.js
│  │
│  ├─Product
│  │      Product.js
│  │
│  └─RecentList
│          RecentList.js
│
├─styles
│      GlobalStyle.js
│
├─SvgImages
│      sort.svg
│
└─utils
        GetDataFromLocalStorage.js
        MoveAfterVisit.js
        SaveDataToLocalStorage.js
```
### src/Components
- 공통으로 쓰이는 Header, Item, NavBar를 포함
### src/Pages/About
- 팀원들의 간단한 소개
### src/Pages/List
- product의 전체 목록
### src/Pages/Product
- List에서 상품 클릭 시 이동하는 상세페이지
- 랜덤으로 다른 상품으로 이동하거나, 현재 상품에 "관심 없음" 설정 가능
### src/Pages/RecentList
- 최근 조회한 목록
### src/utils
- 공통으로 쓰이는 유틸 함수 포함
### src/config.js
- 공통으로 쓰이는 URL 포함
### src/constant.js
- const 상수를 포함
  <br>
  <br>
## 💙Project Link
https://pre-onboarding-assignment.web.app/
