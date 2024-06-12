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
`;

const Content = styled(Box)`
  display: flex;
  width: 100%;
`;

export default Layout;
