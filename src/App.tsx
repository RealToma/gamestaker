import { Box } from "@mui/material";
import styled from "styled-components";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { useEffect, useState } from "react";
import Layout from "./pages/layout";
import MyBets from "./pages/mybets";

const App = () => {
  // const [isEntered, setIsEntered] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const someRequest = (): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), 1500));
  };

  useEffect(() => {
    someRequest().then(() => {
      const loaderElement = document.querySelector(".main-fader");
      if (loaderElement) {
        loaderElement.remove();
        setLoading(!isLoading);
      }
    });
  });

  if (isLoading) {
    //
    return null;
  }

  return (
    <StyledComponent>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/mybets" element={<MyBets />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <NotificationContainer />
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
