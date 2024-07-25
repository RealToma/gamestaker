import { useSDK } from "@metamask/sdk-react";
import { Box } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { NotificationManager } from "react-notifications";
import { useOutsideDetector } from "../../hooks/useOutsideDetector";
import { useNavigate } from "react-router-dom";
import { PlaceBet } from "../../PlaceBet";
import { ChainCode } from "../../web3/chainCode";
import { ethers } from "ethers";
import fakeApiResponse from "../../data/stakerConfig.json";
import { RefContext } from "../../hooks/RefContext";

const Header = () => {
  const { sdk, connected, account } = useSDK();

  useEffect(() => {
    console.log("connected:", connected);
  }, [connected]);
  const connect = async () => {
    try {
      if (connected) {
        setDisconnectOpen(true);
      } else {
        setDisconnectOpen(false);
      }
      await sdk?.connect();
    } catch (error) {
      console.warn(`failed to connect..`, error);
      // NotificationManager.error(error.reason, "", 5000);
    }
  };

  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const { setArrayMyBets }: any = useContext(RefContext);
  const navigate = useNavigate();

  const refConnectDown = useRef(0);
  useOutsideDetector([refConnectDown], () => setDisconnectOpen(false));

  // const connectWallet = () => {
  //   if (isConnected) {
  //     setDisconnectOpen(true);
  //   } else {
  //     setDisconnectOpen(false);
  //   }
  //   if (openConnectModal) {
  //     // openConnectModal();
  //   }
  // };

  const handleDisconnect = () => {
    setDisconnectOpen(false);
    // disconnect();
    sdk?.terminate();
    NotificationManager.warning(
      "The connection has been lost. Please connect your wallet.",
      "",
      3000
    );
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleOpenWorks = () => {
    // window.open("/FLAPPYBEE.pdf");
    window.open("/sample.pdf");
  };

  const handleMyBets = async () => {
    try {
      if (!connected) {
        return NotificationManager.warning("Connect your wallet.", "", 3000);
      }
      await ChainCode.initWallet();
      await ChainCode.initContracts(ChainCode.signer);
      const resGetStakes = await PlaceBet.handleGetStakes(account);
      console.log("resGetMyBets:", resGetStakes);
      if (resGetStakes.length === 0) {
        return NotificationManager.error(
          "You don't have any bets. Please place a bet.",
          "",
          5000
        );
      }
      let arrayMySubtitles = [];
      let arrayMyBets = [];

      for (let i = 0; i < resGetStakes.length; i++) {
        let stake = resGetStakes[i];
        let resDecodeBetId = ethers.decodeBytes32String(stake);
        let stakeInfo = ChainCode.getStakeInfo(resDecodeBetId);
        let contract: any = ChainCode.stakerContracts.get(resDecodeBetId);
        console.log("contract[%s] is %s", resDecodeBetId, contract.target);
        let stakesByContract = await contract.getStakes(account);
        console.log(
          "for stake[%s] %s is game [%s : %s]",
          stakeInfo.type,
          resDecodeBetId,
          stakeInfo.Parties[0],
          stakeInfo.Parties[1]
        );
        for (let m = 0; m < stakesByContract.length; m++) {
          let _stakeInfo = JSON.parse(JSON.stringify(stakeInfo));
          // let option = PlaceBet.getOption(fakeApiResponse[0].GAMES[i].type, stakesByContract[ii]);
          _stakeInfo["option"] = PlaceBet.getOptionInfo(
            stakeInfo,
            Number(stakesByContract[m])
          );
          console.log(
            "found option %s is %s",
            stakesByContract[m],
            _stakeInfo["option"]
          );
          arrayMySubtitles.push(_stakeInfo);
        }
      }
      /*
      for (let i = 0; i < resGetStakes.length; i++) {
        let resDecodeBetId = ethers.decodeBytes32String(resGetStakes[i]);
        for (let j = 0; j < fakeApiResponse.length; j++) {
          for (let k = 0; k < fakeApiResponse[j].GAMES.length; k++) {
            let betName = fakeApiResponse[0].GAMES[k].name;
            if (betName === resDecodeBetId) {
              arrayMySubtitles.push(fakeApiResponse[0].GAMES[k]);
            }
          }
        }
      }
*/
      console.log("arrayMySubtitles:", arrayMySubtitles);
      for (let i = 0; i < fakeApiResponse.length; i++) {
        const tempArrayMyBets: any = {
          TOURNAMENT: fakeApiResponse[i]?.TOURNAMENT,
          GAMES: arrayMySubtitles,
        };
        arrayMyBets.push(tempArrayMyBets);
      }
      console.log("my bets details:", arrayMyBets);
      setArrayMyBets(arrayMyBets);
      navigate("/mybets");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      console.log("error of handleMyBets:", error);
      NotificationManager.error(error.reason, "", 5000);
    }
  };

  return (
    <StyledComponent>
      <SectionLogo
        onClick={() => {
          navigate("/");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <img src={"/assets/images/icons/logo.png"} width={"100%"} alt="logo" />
      </SectionLogo>
      <ButtonHowItWorks onClick={() => handleOpenWorks()}>
        HOW IT WORKS
      </ButtonHowItWorks>
      <SectionButtonGroup>
        <ButtonConnect onClick={connect}>
          {connected
            ? `${account?.slice(0, 6)}...${account?.slice(account.length - 4)}`
            : "Connect wallet"}

          {disconnectOpen && connected ? (
            <ButtonDisconnect onClick={handleDisconnect} ref={refConnectDown}>
              Disconnect
            </ButtonDisconnect>
          ) : (
            <></>
          )}
        </ButtonConnect>
        {connected ? (
          <ButtonMyBets onClick={handleMyBets}>My Bets</ButtonMyBets>
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
  border-radius: 12px;
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
  border-radius: 12px;
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
  border-radius: 12px;
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
  border-radius: 12px;
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
  cursor: pointer;
  user-select: none;
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
