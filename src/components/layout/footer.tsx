import { Box } from "@mui/material";
import styled from "styled-components";

const Footer = () => {
  return (
    <StyledComponent>© 2024 GameStaker. All Rights Reserved.</StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  position: fixed;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: "Inter";
  font-weight: 400;
  font-size: 16px;
  margin-top: 50px;
  margin-bottom: 20px;
  bottom: 0;
  z-index: 20;
  @media (max-width: 1280px) {
    font-size: 15px;
  }
  @media (max-width: 390px) {
    font-size: 13px;
  }
`;

export default Footer;
