import { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import {
  abiMyUSDCContract,
  abiStakeContract,
  getMyBalance,
} from "../../utils/functions";
import { addressDeployContracts } from "../../web3/addressDeployContracts";
import { Address, parseUnits } from "viem";
import styled from "styled-components";
import { Box } from "@mui/material";

const SectionEachOption = ({ each }: any) => {
  const { isConnected, address } = useAccount();
  const [isProcess, setProcess] = useState(false);
  const [amountMYUSDC, setAmountMYUSDC] = useState(0);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleBet = async () => {
    console.log("each:", each);
    try {
      if (!isConnected || !publicClient || !walletClient || !address) {
        return NotificationManager.warning("Connect your wallet.", "", 3000);
      }
      // NotificationManager.info("Coming soon.", "", 3000);
      console.log("net connected:", isConnected);
      console.log("wallet address:", address);
      const myBalance: any = await getMyBalance(address);

      if (amountMYUSDC < 100) {
        return NotificationManager.warning(
          "It should be greater than 100 MYUSDC.",
          "",
          5000
        );
      }

      if (myBalance?.balancePolygon < 0.001) {
        return NotificationManager.warning(
          "You don't have enough matic.",
          "",
          5000
        );
      }
      if (myBalance?.balanceMyUSDC < 100) {
        return NotificationManager.warning(
          "You don't have enough MYUSDC.",
          "",
          5000
        );
      }

      setProcess(true);
      if (isProcess) {
        return NotificationManager.warning(
          "Please wait while processing.",
          "",
          5000
        );
      }
      const { request: requestApprove } = await publicClient.simulateContract({
        account: address,
        abi: abiMyUSDCContract,
        address: addressDeployContracts.myUSDC as Address,
        functionName: "approve",
        args: [
          addressDeployContracts.STAKER_ADDRESS,
          parseUnits(amountMYUSDC.toString(), 6),
        ],
      });

      const hashApprove = await walletClient.writeContract(requestApprove);

      const resApprove = await publicClient.waitForTransactionReceipt({
        hash: hashApprove,
      });

      console.log("resApprove:", resApprove);

      const option = each.optionName;
      let optionNumber = 0;
      if (option === "Local wins (1)") {
        optionNumber = 1;
      } else if (option === "Visitant wins (2)") {
        optionNumber = 2;
      } else if (option === "Tie (x)") {
        optionNumber = 3;
      } else {
        optionNumber = 0;
      }
      const { request: requestStake } = await publicClient.simulateContract({
        account: address,
        abi: abiStakeContract,
        address: addressDeployContracts.STAKER_ADDRESS as Address,
        functionName: "create_stake",
        args: [
          BigInt(optionNumber),
          addressDeployContracts.myUSDC,
          parseUnits(amountMYUSDC.toString(), 6),
        ],
      });

      const hashStake = await walletClient.writeContract(requestStake);

      const resStake = await publicClient.waitForTransactionReceipt({
        hash: hashStake,
      });
      console.log("resStake:", resStake);
      NotificationManager.success("Completed successfully.", "", 5000);
    } catch (error) {
      setProcess(false);
      console.log("error of create stake:", error);
    } finally {
      setProcess(false);
    }
  };

  return (
    <StyledComponent each={each}>
      <TextOption>{each.optionName}</TextOption>
      <TextRatio>Ratio: {each.ratio}</TextRatio>
      {each.optionName === "Exact Score" ? (
        <SectionGroupInput>
          <SectionInput>
            <InputBetValue
              component="input"
              placeholder="local : visitant"
            ></InputBetValue>
          </SectionInput>
          <SectionInput ml="10px">
            <InputBetValue
              component="input"
              placeholder="Token amount"
            ></InputBetValue>
          </SectionInput>
        </SectionGroupInput>
      ) : (
        <SectionGroupInput>
          <SectionInput>
            <InputBetValue
              component="input"
              placeholder="Input MYUSDC amount"
              onChange={(e: any) => {
                setAmountMYUSDC(e.target.value);
              }}
            ></InputBetValue>
          </SectionInput>
        </SectionGroupInput>
      )}

      <ButtonBet
        disabled={isProcess}
        isProcess={isProcess ? 1 : 0}
        onClick={() => handleBet()}
      >
        {isProcess ? "Processing" : "Bet"}
      </ButtonBet>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 15px;
  align-items: center;
  @media (max-width: 768px) {
    margin-top: 10px;
  }
  @media (max-width: 600px) {
    display: grid;
    width: 100%;
    margin-top: 20px;
    grid-template-columns: 2fr 1fr;
    grid-row-gap: 10px;
    grid-column-gap: 10px;
  }
`;

const TextOption = styled(Box)`
  display: flex;
  flex: 1;
  margin-left: 100px;
  white-space: nowrap;
  @media (max-width: 1440px) {
    margin-left: 70px;
    flex: 0.8;
  }
  @media (max-width: 900px) {
    margin-left: 30px;
    flex: 0.6;
  }
  @media (max-width: 768px) {
    margin-left: 20px;
  }
  @media (max-width: 600px) {
    margin-left: 0px;
  }
`;

const TextRatio = styled(Box)`
  display: flex;
  flex: 1;
  margin-left: 50px;
  @media (max-width: 1440px) {
    margin-left: 30px;
    flex: 0.8;
  }
  @media (max-width: 900px) {
    margin-left: 20px;
    flex: 0.6;
  }
  @media (max-width: 768px) {
    margin-left: 20px;
    flex: 0.4;
  }
  @media (max-width: 600px) {
    justify-content: flex-end;
  }
`;

const SectionGroupInput = styled(Box)`
  display: flex;
  flex: 1.5;
  margin-left: 50px;
  @media (max-width: 768px) {
    margin-left: 20px;
    flex: 0.8;
  }
  @media (max-width: 600px) {
    margin-left: 0px;
  }
`;

const SectionInput = styled(Box)`
  display: flex;
  width: 100%;
  background-color: #272727;
  border-radius: 20px;
  height: 40px;
  padding: 0px 20px;
  box-sizing: border-box;

  transition: 0.3s;
  &:hover {
    box-shadow: 0px 0px 10px white;
  }
  @media (max-width: 1280px) {
    height: 35px;
  }
  @media (max-width: 768px) {
    padding: 0px 15px;
    flex: 0.8;
    &:hover {
      box-shadow: 0px 0px 6px white;
    }
  }
  @media (max-width: 600px) {
    margin-left: 0px;
    width: 100%;
    flex: 1;
  }
`;

const InputBetValue = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background-color: #272727;
  color: white;
  font-family: "Inter";
  font-weight: 500;
  font-size: 20px;

  @media (max-width: 1440px) {
    font-size: 18px;
  }
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ButtonBet = styled.button`
  display: flex;
  width: 130px;
  justify-content: center;
  box-sizing: border-box;
  /* width: 100%; */
  margin-left: 50px;
  outline: none;
  border: none;
  height: 40px;
  align-items: center;
  background-color: #48b415;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  border-radius: 20px;
  cursor: ${({ isProcess }: any) => (isProcess ? "wait" : "pointer")};
  user-select: none;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #48b415;
  }

  @media (max-width: 1440px) {
    width: 120px;
  }
  @media (max-width: 1280px) {
    width: 100px;
    font-weight: 500;
    font-size: 15px;
    height: 35px;
    font-size: 14px;
  }
  @media (max-width: 768px) {
    margin-left: 10px;
  }
  @media (max-width: 600px) {
    flex: 1;
    width: 100%;
    font-size: 12px;
  }
`;

export default SectionEachOption;
