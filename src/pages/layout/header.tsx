import { Box } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const Header = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { openConnectModal } = useConnectModal();

  const connectWallet = () => {
    if (isConnected) {
      setDisconnectOpen((prev) => !prev);
    } else {
      if (openConnectModal) {
        openConnectModal();
      }
    }
  };

  const handleDisconnect = () => {
    setDisconnectOpen(false);
    disconnect();
    setOpen(false);
  };

  return (
    <StyledComponent>
      <ButtonHowItWorks>HOW IT WORKS</ButtonHowItWorks>
      <ButtonConnect>

      </ButtonConnect>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
  height: 350px;
  padding: 100px 100px;
  box-sizing: border-box;
  background-image: url("/assets/images/background/header.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
`;

const ButtonHowItWorks = styled(Box)`
  display: flex;
  width: 300px;
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #c40632;
  color: white;
  font-weight: 600;

  border-radius: 20px;
  cursor: pointer;
  user-select: none;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #c40632;
  }
`;

const ButtonConnect = styled(Box)`
  display: flex;
  width: 300px;
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #c40632;
  color: white;
  font-weight: 600;

  border-radius: 20px;
  cursor: pointer;
  user-select: none;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #c40632;
  }
`;


export default Header;
