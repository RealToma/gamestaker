import { Box } from "@mui/material";
import styled from "styled-components";
import Header from "./header";
import Footer from "./footer";

const Layout = ({ children }: any) => {
  return (
    <StyledComponent>
      <Header />
      <Content>
        <BackVideo>
          <video loop muted autoPlay>
            <source src="/assets/videos/stadium.mp4" type="video/mp4" />
          </video>
        </BackVideo>
        <InsideContent>{children}</InsideContent>
      </Content>
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

const BackVideo = styled(Box)`
  /* display: flex; */
  position: fixed;
  top: 0;
  left: 0;
  /* left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
  filter: blur(2px);
  > video {

    width: 100vw;
    height: 100vh;
    object-position: center;
    object-fit: cover;
  }

  z-index: 9;
`;

const InsideContent = styled(Box)`
  display: flex;
  width: 100%;

  padding: 50px 80px;
  box-sizing: border-box;
  z-index: 10;
`;

export default Layout;
