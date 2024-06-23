import { Box, Collapse } from "@mui/material";
import styled from "styled-components";
import { RiLogoutBoxRLine, RiLogoutBoxLine } from "react-icons/ri";

import { useState } from "react";
import { NotificationManager } from "react-notifications";
import { PlaceBet } from "../../PlaceBet";
import { useAccount } from "wagmi";
import { ChainCode } from "../../web3/chainCode";
// import { getGoogleSheetData } from "../../utils/functions";

const SectionBetGroup = ({
  data,
  index,
  indexGroupClicked,
  setIndexGroupClicked,
}: any) => {
  const { isConnected, address } = useAccount();
  const [isProcess, setProcess] = useState(false);

  const handleClickDown = async () => {
    // const response = await fetch("/assets/csv/MChoiceStakerData.csv"); // Adjust the file path as per your project structure
    // const data = await response.text();
    // Papa.parse(data, {
    //   header: true,
    //   dynamicTyping: true,
    //   complete: function (results: any) {
    //     console.log("Parsed CSV data:", results.data);
    //     // Process the parsed CSV data based on object format
    //     results.data.forEach((item: any) => {
    //       // Access each item in the CSV data and process it based on object format
    //       console.log(item);
    //     });
    //   },
    // });
    if (!isConnected || !address) {
      return NotificationManager.warning("Connect your wallet.", "", 3000);
    }
    if (indexGroupClicked === index) {
      setIndexGroupClicked(-1);
      return;
    }
    setIndexGroupClicked(index);
    // await getGoogleSheetData();
    await ChainCode.initWallet();
    try {
      await ChainCode.initContracts(ChainCode.signer);
      // for (let stake of stakerContracts.values()) {
      //   console.log("received stake[%s]=%s", stake.name, stake.address);
      // }
    } catch (error: any) {
      console.log("error of initContracts:", error);
      NotificationManager.error(error.reason, "", 5000);
    }
  };
  const [selectedStake, setSelectedStake] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const handleOptionSelect = (stake: string, optionIndex: number) => {
    setSelectedStake(stake);
    setSelectedOption(optionIndex);
  };

  const calculateOdds = (options: any[], amount: number) => {
    // winner_rate = (amount_1 + amount_2)*(1-fee)/amount_3
    const fee = parseFloat(process.env.REACT_APP_FEE || "0");
    const totalAmount = options.reduce((acc, option) => acc + option.amount, 0);
    const nonWinnerAmount = totalAmount - amount;
    const winnerOdds = (nonWinnerAmount * (1 - fee)) / amount;
    return winnerOdds;
  };

  const [betAmount, setBetAmount] = useState<string>("");
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  /*
   ** sc_add (bettingIndex: integer($int32), amount: integer($int256))**
   *
   * Users selects option and adds tokens.
   * Tokens are added to the pool of the selected option.
   * Event handler for submitting the bet
   * This is where the API integration for '/sc_add' occurs
   */

  const handleAddingBet = async () => {
    if (selectedOption === null) {
      NotificationManager.warning("Please select an option.", "", 3000);
      return;
    }

    if (betAmount === "" || betAmount === undefined || betAmount === null) {
      return NotificationManager.warning("Please input bet amount.", "", 3000);
    }

    const amount = parseInt(betAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      NotificationManager.warning("Please enter a valid bet amount.", "", 3000);
      // alert("Please enter a valid bet amount.");
      return;
    }

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
      await PlaceBet.handleAddingBet(
        selectedStake,
        selectedOption,
        betAmount,
        "USDC" // bettingTokenType
      );
      setProcess(false);
      setTimeout(() => {
        NotificationManager.success("Completed successfully.", "", 5000);
      }, 1000);
    } catch (error: any) {
      setProcess(false);
      console.log("error of create stake:", error);
      NotificationManager.error(error.reason, "", 5000);
    }
    //  finally {
    //   setProcess(false);
    // }
  };

  return (
    <>
      <StyledComponent>
        <SectionBetHeader>
          <ButtonGroupBet onClick={() => handleClickDown()}>
            <span> {data.title}</span>
            {indexGroupClicked === index ? (
              <RiLogoutBoxLine />
            ) : (
              <RiLogoutBoxRLine />
            )}
          </ButtonGroupBet>
          {indexGroupClicked === index ? (
            <SectionHeaderRight active={indexGroupClicked === index ? 1 : 0}>
              <SectionInput>
                <InputBetValue
                  component="input"
                  placeholder="Input bet"
                  value={betAmount}
                  onChange={handleBetAmountChange}
                ></InputBetValue>
              </SectionInput>

              <ButtonBet
                // disabled={isProcess}
                isprocess={isProcess ? 1 : 0}
                onClick={handleAddingBet}
              >
                {isProcess ? "Processing" : "Place Bet"}
              </ButtonBet>
            </SectionHeaderRight>
          ) : (
            <></>
          )}
        </SectionBetHeader>

        <Collapse in={indexGroupClicked === index ? true : false}>
          <SectionContent active={indexGroupClicked === index ? 1 : 0}>
            {data?.subtitles.map((each: any, index: any) => {
              const _index = index;
              return (
                <SectionEachBet key={_index}>
                  <TextBetGroupName>
                    {each.text}&nbsp;&nbsp;{each.time}
                  </TextBetGroupName>
                  <SectionBetOptionGroup>
                    <SectionBetEachOption>
                      {each.options.map((option: any, idx: any) => (
                        <SectionEachOptionGroup key={idx}>
                          <button
                            key={option.name}
                            type="button"
                            style={{
                              height: "40px",
                              borderRadius: "6px",
                            }}
                            className={`btn ${
                              selectedOption === option.optionIndex
                                ? "btn-primary"
                                : "btn-outline-primary"
                            } w-100 text-white`}
                            onClick={() =>
                              handleOptionSelect(each.id, option.optionIndex)
                            }
                          >
                            {option.name}
                          </button>
                          <div
                            key={option.amount}
                            style={{ borderRadius: "6px" }}
                            className={`w-100 text-center ${
                              selectedOption === option.optionIndex
                                ? "bg-warning"
                                : "bg-secondary"
                            } border-secondary border-[12px] mt-1`}
                          >
                            {calculateOdds(each.options, option.amount).toFixed(
                              2
                            )}
                          </div>
                        </SectionEachOptionGroup>
                      ))}
                    </SectionBetEachOption>
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

  opacity: ${({ active }: any) => (active ? 1 : 0)};
  transition: 1s;
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
  margin-top: 10px;
  margin-bottom: 10px;
  flex-direction: column;

  @media (max-width: 1280px) {
    margin-top: 0px;
    margin-bottom: 30px;
  }
`;

const TextBetGroupName = styled(Box)`
  /* text-transform: uppercase; */
  color: #73da13;
  margin-bottom: 5px;
`;

const SectionBetOptionGroup = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: white;
`;

const SectionBetHeader = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionHeaderRight = styled(Box)`
  display: flex;
  align-items: center;
  opacity: ${({ active }: any) => (active ? 1 : 0)};
  transition: 1s;
  @media (max-width: 600px) {
    width: 100%;
    margin-top: 30px;
  }
`;

const SectionInput = styled(Box)`
  display: flex;
  width: 200px;
  background-color: #272727;
  border-radius: 12px;
  height: 50px;
  padding: 0px 15px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0);

  transition: 0.3s;
  &:hover {
    border: 1px solid white;
  }
  @media (max-width: 1440px) {
    width: 180px;
    height: 45px;
  }
  @media (max-width: 768px) {
    height: 35px;
    padding: 0px 12px;
    &:hover {
      box-shadow: 0px 0px 6px white;
    }
  }
  @media (max-width: 600px) {
    flex: 3;
    width: 100%;
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
  width: 150px;
  justify-content: center;
  box-sizing: border-box;
  /* width: 100%; */
  margin-left: 20px;
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
    height: 35px;
    margin-left: 10px;
    height: 35px;
    font-size: 15px;
    padding: 0px 18px;
  }
  @media (max-width: 600px) {
    flex: 1.5;
    width: 100%;
    font-size: 13px;
  }
`;

const SectionBetEachOption = styled(Box)`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 30px;
  @media (max-width: 1280px) {
    grid-column-gap: 20px;
  }
  @media (max-width: 500px) {
    grid-column-gap: 10px;
  }
`;

const SectionEachOptionGroup = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export default SectionBetGroup;
