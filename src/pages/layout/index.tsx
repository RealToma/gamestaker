import { Box } from "@mui/material";
import styled from "styled-components";
import Header from "./header";
import Footer from "./footer";

const Layout = ({ children }: any) => {
  return (
    <StyledComponent>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;

  animation: animateBack 500ms linear;
  @keyframes animateBack {
        0% {
          opacity: 0;
        }
        80% {
          opacity: 0.6;
        }
        100% {
          opacity: 1;
        }
      }
`;

const Content = styled(Box)`
  display: flex;
  width: 100%;
`;

export default Layout;
