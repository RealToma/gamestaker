import { Box } from "@mui/material";
import { useRef, useState } from "react";
import styled from "styled-components";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useOutsideDetector } from "../../hooks/useOutsideDetector";

const Header = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const { openConnectModal } = useConnectModal();

  const refConnectDown = useRef(0);
  useOutsideDetector([refConnectDown], () => setDisconnectOpen(false));

  const connectWallet = () => {
    if (isConnected) {
      setDisconnectOpen(true);
    } else {
      setDisconnectOpen(false);
      if (openConnectModal) {
        openConnectModal();
      }
    }
  };

  const handleDisconnect = () => {
    setDisconnectOpen(false);
    disconnect();
  };

  const handleOpenWorks = () => {
    // window.open("/FLAPPYBEE.pdf");
    window.open("https://github.com/RealToma/gamestaker/blob/main/README.md");
  };

  return (
    <StyledComponent>
      <ButtonHowItWorks onClick={() => handleOpenWorks()}>
        HOW IT WORKS
      </ButtonHowItWorks>
      <SectionButtonGroup>
        {isConnected ? <ButtonMyBets>My Bets</ButtonMyBets> : <></>}
        <ButtonConnect onClick={connectWallet}>
          {isConnected
            ? `${address?.slice(0, 6)}...${address?.slice(address.length - 4)}`
            : "Connect wallet"}
          {disconnectOpen && isConnected ? (
            <ButtonDisconnect onClick={handleDisconnect} ref={refConnectDown}>
              Disconnect
            </ButtonDisconnect>
          ) : (
            <></>
          )}
        </ButtonConnect>
      </SectionButtonGroup>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  height: 350px;
  justify-content: space-between;
  padding: 100px 80px;
  box-sizing: border-box;
  background-image: url("/assets/images/background/header.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
`;

const SectionButtonGroup = styled(Box)`
  display: flex;
  /* align-items: center; */
`;

const ButtonHowItWorks = styled(Box)`
  display: flex;
  width: 250px;
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #c40632;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
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
  position: relative;
  width: 250px;
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #ffae00;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #ffca00;
  }
`;

const ButtonDisconnect = styled(Box)`
  display: flex;
  position: absolute;
  width: 250px;
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #1e202a;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;

  left: 50%;
  transform: translateX(-50%);
  top: 60px;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #1e202a;
  }
`;

const ButtonMyBets = styled(Box)`
  display: flex;
  width: 200px;
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #48b415;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;

  margin-right: 20px;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #48b415;
  }
`;

export default Header;
