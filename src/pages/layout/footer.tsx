import { Box } from "@mui/material";
import styled from "styled-components";

const Footer = () => {
  return (
    <StyledComponent>© 2024 GameStaker. All Rights Reserved.</StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: "Inter";
  font-weight: 400;
  font-size: 16px;
  margin-top: 50px;
  margin-bottom: 20px;
`;

export default Footer;
