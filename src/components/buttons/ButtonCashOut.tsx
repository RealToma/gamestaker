import { Box } from "@mui/material";
import { useContext, useState } from "react";
import { NotificationManager } from "react-notifications";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { ChainCode } from "../../web3/chainCode";
import { CashOutClass } from "../../CashOut";
import { ethers } from "ethers";
import fakeApiResponse from "../../data/stakerConfig.json";
import { PlaceBet } from "../../PlaceBet";
import { RefContext } from "../../hooks/RefContext";
import { useNavigate } from "react-router-dom";

const ButtonCashOut = ({ stakeID }: any) => {
  const [isProcess, setProcess] = useState(false);
  const { isConnected, address } = useAccount();
  const { setArrayMyBets }: any = useContext(RefContext);
  const navigate = useNavigate();

  const handleCashOut = async () => {
    console.log("stakeID:", stakeID);

    if (!isConnected || !address) {
      return NotificationManager.warning("Connect your wallet.", "", 3000);
    }
    setProcess(true);
    if (isProcess) {
      return NotificationManager.warning(
        "Please wait while processing.",
        "",
        5000
      );
    }
    try {
      await ChainCode.initWallet();
      await ChainCode.initContracts(ChainCode.signer);
      let userWallet = await ChainCode.signer.getAddress();

      // TODO: choose stake contract based on 'selectedGame', i.e. which game
      console.log("selectedStake:", stakeID);

      await CashOutClass.cashOut(stakeID, userWallet);

      setProcess(false);
      setTimeout(() => {
        NotificationManager.success("Completed successfully.", "", 5000);
      }, 1000);

      const resGetStakes = await PlaceBet.handleGetStakes(address);
      console.log("resGetMyBets:", resGetStakes);
      if (resGetStakes.length === 0) {
        NotificationManager.error(
          "You don't have any bets. Please place a bet.",
          "",
          5000
        );
        navigate("/");
        return;
      }
      let arrayMySubtitles = [];
      let arrayMyBets = [];
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
    } catch (error: any) {
      setProcess(false);
      // console.log(JSON.stringify(error));
      // const tempError: any = JSON.stringify(error);
      console.log("error of cash out:", error);
      NotificationManager.error(error.reason, "", 5000);
    }
  };

  return (
    <StyledComponent
      isprocess={isProcess ? 1 : 0}
      onClick={() => handleCashOut()}
    >
      {isProcess ? "Processing" : "Cash Out"}
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 150px;
  justify-content: center;
  box-sizing: border-box;
  /* width: 100%; */
  /* margin-left: 20px; */
  outline: none;
  border: none;
  height: 50px;
  align-items: center;
  background-color: #48b415;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 18px;
  text-transform: uppercase;
  border-radius: 12px;
  cursor: ${({ isprocess }: any) => (isprocess ? "wait" : "pointer")};
  user-select: none;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #48b415;
  }

  @media (max-width: 1440px) {
    width: 120px;
    height: 45px;
    font-size: 16px;
  }
  @media (max-width: 768px) {
    height: 40px;
    /* margin-left: 10px; */
    font-size: 15px;
    padding: 0px 18px;
  }
  @media (max-width: 600px) {
    width: 100%;
    margin-top: 5px;
  }
`;

export default ButtonCashOut;
