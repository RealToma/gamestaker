import { Box } from "@mui/material";
import { useRef, useState } from "react";
import styled from "styled-components";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useOutsideDetector } from "../../hooks/useOutsideDetector";
import { NotificationManager } from "react-notifications";

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

  const handleMyBets = () => {
    return NotificationManager.info("Coming soon.", "", 3000);
  };

  return (
    <StyledComponent>
      <SectionLogo>
        <img src={"/assets/images/icons/logo.png"} width={"100%"} alt="logo" />
      </SectionLogo>
      <ButtonHowItWorks onClick={() => handleOpenWorks()}>
        HOW IT WORKS
      </ButtonHowItWorks>
      <SectionButtonGroup>
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
        {isConnected ? (
          <ButtonMyBets onClick={() => handleMyBets()}>My Bets</ButtonMyBets>
        ) : (
          <></>
        )}
      </SectionButtonGroup>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
  height: 300px;
  justify-content: space-between;
  padding: 50px 80px;
  box-sizing: border-box;
  /* background-image: url("/assets/images/background/header.png"); */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 1600px) {
  }
  @media (max-width: 1440px) {
    padding: 50px 60px;
  }
  @media (max-width: 1280px) {
    padding: 50px 50px;
    background-size: cover;
  }
  @media (max-width: 768px) {
    padding: 50px 50px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
  }
  @media (max-width: 500px) {
    padding: 50px 30px;
    height: 270px;
  }
  @media (max-width: 390px) {
  }
  /* z-index: 20; */
`;

const SectionButtonGroup = styled(Box)`
  display: flex;
  /* align-items: center; */
  @media (max-width: 768px) {
    margin-top: 10px;
    padding-bottom: -100px;
  }
  @media (max-width: 500px) {
    margin-top: 10px;
    padding-bottom: 0px;
  }
`;

const ButtonHowItWorks = styled(Box)`
  display: flex;
  position: absolute;
  width: 250px;
  height: 50px;
  left: 100px;
  top: 50px;
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

  @media (max-width: 1440px) {
    width: 200px;
    height: 45px;
    font-size: 18px;
    left: 60px;
  }
  @media (max-width: 1280px) {
    left: 40px;
  }
  @media (max-width: 768px) {
    width: 250px;
    height: 35px;
    font-size: 16px;
    left: 50%;
    transform: translateX(-50%);
    top: 250px;
  }
  @media (max-width: 500px) {
    width: 200px;
    height: 35px;
    font-size: 15px;
  }

  z-index: 100;
`;

const ButtonConnect = styled(Box)`
  display: flex;
  position: absolute;
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
  right: 100px;
  top: 50px;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #ffca00;
  }
  @media (max-width: 1440px) {
    width: 200px;
    height: 45px;
    font-size: 18px;
    right: 60px;
  }
  @media (max-width: 1280px) {
    right: 40px;
  }
  @media (max-width: 768px) {
    width: 250px;
    height: 35px;
    font-size: 16px;
    left: 50%;
    transform: translateX(-50%);
    top: 300px;
  }
  @media (max-width: 500px) {
    width: 200px;
    height: 35px;
    font-size: 15px;
  }

  z-index: 100;
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
  @media (max-width: 1440px) {
    width: 200px;
    height: 45px;
    font-size: 18px;
    top: 60px;
  }
  @media (max-width: 768px) {
    width: 250px;
    height: 35px;
    font-size: 16px;
    top: 45px;
  }
  @media (max-width: 500px) {
    width: 200px;
    height: 35px;
    font-size: 15px;
    top: 45px;
  }

  z-index: 110;
`;

const ButtonMyBets = styled(Box)`
  display: flex;
  position: absolute;
  width: 250px;
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

  right: 100px;
  top: 110px;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #48b415;
  }
  @media (max-width: 1440px) {
    width: 200px;
    height: 45px;
    font-size: 18px;
    right: 60px;
  }
  @media (max-width: 1280px) {
    right: 40px;
  }
  @media (max-width: 768px) {
    width: 250px;
    height: 35px;
    font-size: 16px;
    left: 50%;
    transform: translateX(-50%);
    top: 345px;
  }
  @media (max-width: 500px) {
    width: 200px;
    height: 35px;
    font-size: 15px;
  }

  z-index: 90;
`;

const SectionLogo = styled(Box)`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 30px;
  width: 160px;
  z-index: 21;

  @media (max-width: 1280px) {
    width: 150px;
  }
  @media (max-width: 375px) {
    width: 130px;
    top: 40px;
  }
  /* @media (max-width: 500px) {
    width: 130px;
  } */
`;

export default Header;
