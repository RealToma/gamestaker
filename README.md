# Gamestaker

## 1. Project Topic:
- The project topic is to program a betting pool for tournaments like the European football championship.
- The transaction layer for the betting pool will be based on cryptocurrency (crypto).

## 2. Data Handling:
- The actual uploading of data, such as groups, teams, and places, will be done using Excel or Google Sheets.
- The frontend of the application will be parametrized based on the Figma design, allowing for the deployment of different leagues in parallel by simply adding the data.


## 3. Frontend (FE) and Integration :
- The frontend will pass the initial data (matches and parties) to a smart contract (SC) function.
- The frontend will interact with the smart contracts using a swagger RESTful API.
- The reason for this approach is to create separate ERC20 "bet" tokens per game per outcome, and then payout all the bet USDT of that game to the holders of the "winning" ERC20.
- The smart contracts will issue events, which the frontend will catch.
If needed, the smart contracts can also provide read (view) functions to allow querying of the smart contract state.

### 3.1. Frontend Development:
- The target is to implement the project by translating the figma design into the frontend using React.js or Next.js including styled-components, material-ui and etc.
- The frontend UI will be integrated with the backend API endpoints (Swagger) and the smart contracts using ethers.js v6. (exactly version 6.1.3)
- The application will use the wagmi library and rainbow toolkit to connect wallets based on Binance Smart Chain (BSC) and Polygon network.
- All frontend UI pages should be responsive, working on various device resolutions, such as desktop, laptop, ipad and mobile devices.

### 3.2. Integration of Frontend and "Backend" (smart contracts)
Smart contracts do not give return values for executed transactions. Instead, events are issued, in which the smart contract publishes what can be considered its return values.
Calls from the FE to the SC are therefore asynchronous because the FE needs to

1. call an internal library function, the `invoker`, within which the actual (ethers.js) call to the smart contract is called.
2. The `invoker` then subscribes to a "return event" for that function.
3. There are two ways to collect the return values:
   1. `await` the return of the event directly at the subscription. This is simple to code by not very efficient.
   **We will use this way in the MVP**.
   2. Pass in a callback `event handler` when subscribing to the `return event`. This necessitates fully asynchronous code (the `event handler`will be called "whenever" and the main code thread will be "wherever").
   **We need to refactor the code to this way after initial MVP**

## In summary, the key points are:
- Crypto based betting pool for tournaments
- Data management using Excel or Google Sheets
- Parametrized frontend based on Figma design
- Integration of frontend with smart contracts and backend API (swagger)
- Responsive frontend development using React.js(or next.js) & material-ui & styled-components, ethers.js, wagmi, rainbow and etc.


## Available Scripts
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
