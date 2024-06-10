import { Box } from "@mui/material";
import styled from "styled-components";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { useEffect, useState } from "react";

const App = () => {
  // const [isEntered, setIsEntered] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const someRequest = (): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), 1500));
  };

  useEffect(() => {
    someRequest().then(() => {
      const loaderElement = document.querySelector(".content_ring");
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
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <NotificationContainer />
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  /* background-color: #121212; */
`;

export default App;
