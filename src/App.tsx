import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SportsBet from "./pages/Home";
import Oracle from "./pages/Oracle";
import CashOut from "./pages/CashOut";
import styled from "styled-components";
import { Box } from "@mui/material";
import "./App.css";
import Layout from "./components/layout";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import MyBets from "./pages/MyBets";

// declare global {
//   interface Window {
//     ethereum: any;
//   }
// }

const App: React.FC = () => {
  return (
    <StyledComponent>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route key="SportsBet" path="/" element={<SportsBet />} />
            <Route key="Oracle" path="/oracle" element={<Oracle />} />
            <Route key="CashOut" path="/cashOut" element={<CashOut />} />
            <Route key="MyBets" path="/mybets" element={<MyBets />} />
          </Routes>
        </Layout>
        <NotificationContainer />
      </BrowserRouter>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #133bda;
`;

export default App;
