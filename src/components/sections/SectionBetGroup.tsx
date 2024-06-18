import { Box, Collapse } from "@mui/material";
import styled from "styled-components";
import { RiLogoutBoxRLine, RiLogoutBoxLine } from "react-icons/ri";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { NotificationManager } from "react-notifications";
import {
  abiMyUSDCContract,
  abiStakeContract,
  getMyBalance,
} from "../../utils/functions";
import { useState } from "react";
import { addressDeployContracts } from "../../web3/addressDeployContracts";
import { Address, parseUnits } from "viem";
// import { getGoogleSheetData } from "../../utils/functions";

const SectionBetGroup = ({
  data,
  index,
  indexGroupClicked,
  setIndexGroupClicked,
}: any) => {
  const { isConnected, address } = useAccount();
  const [amountMYUSDC, setAmountMYUSDC] = useState(0);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleClickDown = async () => {
    if (indexGroupClicked === index) {
      setIndexGroupClicked(-1);
      return;
    }
    setIndexGroupClicked(index);

    // await getGoogleSheetData();
  };

  const handleBet = async () => {
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

      console.log("amountMYUSDC:", amountMYUSDC);

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

      const { request: requestStake } = await publicClient.simulateContract({
        account: address,
        abi: abiStakeContract,
        address: addressDeployContracts.STAKER_ADDRESS as Address,
        functionName: "create_stake",
        args: [
          BigInt(0),
          addressDeployContracts.myUSDC,
          parseUnits(amountMYUSDC.toString(), 6),
        ],
      });

      const hashStake = await walletClient.writeContract(requestStake);

      const resStake = await publicClient.waitForTransactionReceipt({
        hash: hashStake,
      });

      
      console.log("resStake:", resStake);
    } catch (error) {
      console.log("error of create stake:", error);
    }
  };

  return (
    <>
      <StyledComponent>
        <ButtonGroupBet onClick={() => handleClickDown()}>
          <span> {data.groupName}</span>
          {indexGroupClicked === index ? (
            <RiLogoutBoxLine />
          ) : (
            <RiLogoutBoxRLine />
          )}
        </ButtonGroupBet>
        <Collapse in={indexGroupClicked === index ? true : false}>
          <SectionContent>
            {data?.groupBets.map((each: any, index: any) => {
              const _index = index;
              return (
                <SectionEachBet key={_index}>
                  <TextBetGroupName>
                    {each.groupBetName}&nbsp;&nbsp;{each.betBefore}
                  </TextBetGroupName>
                  <SectionBetOptionGroup>
                    {each.options.map((each: any, index: any) => {
                      const __index = index;
                      if (each.optionName === "Exact Score") {
                        return (
                          <SectionEachOption key={__index}>
                            <TextOption>{each.optionName}</TextOption>
                            <TextRatio>Ratio: {each.ratio}</TextRatio>
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

                            <ButtonBet onClick={() => handleBet()}>
                              Bet
                            </ButtonBet>
                          </SectionEachOption>
                        );
                      } else {
                        return (
                          <SectionEachOption key={__index}>
                            <TextOption>{each.optionName}</TextOption>
                            <TextRatio>Ratio: {each.ratio}</TextRatio>
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

                            <ButtonBet onClick={() => handleBet()}>
                              Bet
                            </ButtonBet>
                          </SectionEachOption>
                        );
                      }
                    })}
                  </SectionBetOptionGroup>
                </SectionEachBet>
              );
            })}
          </SectionContent>
        </Collapse>
      </StyledComponent>
      <Backdrop open={indexGroupClicked === index ? 1 : 0} />
    </>
  );
};

const Backdrop = styled(Box)<any>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ open }: any) => (!open ? "transparent" : "rgba(0,0,0,.7)")};
  z-index: 54;
  transition: 0.3s;
  transform-origin: center;
  transform: ${({ open }: any) => (!open ? "scale(0)" : "scale(1)")};
`;

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  z-index: 55;

  @media (max-width: 1440px) {
    font-size: 18px;
  }
  @media (max-width: 768px) {
    font-size: 16px;
    font-weight: 500;
  }
`;

const SectionContent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const ButtonGroupBet = styled(Box)`
  display: flex;
  /* display: ${({ active }: any) => (active === 1 ? "flex" : "none")}; */
  width: 250px;
  height: 50px;
  padding: 0px 20px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  background-color: #c40632;
  text-transform: uppercase;
  border-radius: 20px;
  margin-bottom: 20px;
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
  }
  @media (max-width: 768px) {
    width: 200px;
    height: 35px;
    font-size: 16px;
    padding: 0px 18px;
  }
  @media (max-width: 500px) {
    width: 180px;
    height: 35px;
    font-size: 15px;
    padding: 0px 16px;
  }
`;

const SectionEachBet = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 30px;
  flex-direction: column;

  @media (max-width: 1280px) {
    margin-top: 0px;
    margin-bottom: 30px;
  }
`;

const TextBetGroupName = styled(Box)`
  /* text-transform: uppercase; */
  color: #73da13;
`;

const SectionBetOptionGroup = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: white;
`;

const SectionEachOption = styled(Box)`
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

const ButtonBet = styled(Box)`
  display: flex;
  width: fit-content;
  justify-content: center;
  padding: 0 40px;
  box-sizing: border-box;
  /* width: 100%; */
  margin-left: 50px;

  height: 40px;
  align-items: center;
  background-color: #48b415;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #48b415;
  }

  @media (max-width: 1440px) {
    padding: 0 30px;
  }
  @media (max-width: 1280px) {
    padding: 0 25px;
    font-weight: 500;
    font-size: 15px;
    height: 35px;
  }
  @media (max-width: 768px) {
    margin-left: 10px;
  }
  @media (max-width: 600px) {
    flex: 1;
    width: 100%;
  }
`;

export default SectionBetGroup;
