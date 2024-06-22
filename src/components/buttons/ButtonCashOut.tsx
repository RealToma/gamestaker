import { Box } from "@mui/material";
import { useState } from "react";
import { NotificationManager } from "react-notifications";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { ChainCode } from "../../web3/chainCode";
import { CashOutClass } from "../../CashOut";

const ButtonCashOut = ({ stakeID }: any) => {
  const [isProcess, setProcess] = useState(false);
  const { isConnected, address } = useAccount();

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
