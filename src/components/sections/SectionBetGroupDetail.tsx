import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import styled from "styled-components";
import { PlaceBet } from "../../PlaceBet";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { ChainCode } from "../../web3/chainCode";
import { useSDK } from "@metamask/sdk-react";

const SectionBetGroupDetail = ({ data }: any) => {
  const { connected, account } = useSDK();
  const [typeMultiChoice, setTypeMultiChoice] = useState(-1);
  const [selectedStake, setSelectedStake] = useState<string>("");
  const [isProcess, setProcess] = useState(false);

  const [betAmount, setBetAmount] = useState<string>("");
  const [betScore1, setBetScore1] = useState<string>("");
  const [betScore2, setBetScore2] = useState<string>("");
  const [betExactScore, setExactScore]: any = useState([]);
  const [ratio, setRatio] = useState(1.0);
  const [ratios, setRatiosMultiChoice] = useState([
    {
      id: "win",
      rate: 0,
    },
    {
      id: "tie",
      rate: 0,
    },
    {
      id: "lose",
      rate: 0,
    },
  ]);

  const [ratiosExactScore, setRatioExactScore]: any = useState([]);

  const handleBetAmountChange = async (value: any, stake: any) => {
    // if (value === null || value === undefined || value === "") {
    //   setBetAmount(value);
    //   setRatio(1.0);
    //   return;
    // }
    setBetAmount(value);
    let score = parseInt(betScore1) * 10 + parseInt(betScore2);

    let decimals: number = Number(await ChainCode.usdcContract.decimals());

    try {
      let resRatio = await PlaceBet.handleGetRatio(stake, score);
      const totalVolume = parseInt(formatUnits(resRatio[0], Number(decimals)));
      console.log("totalVolume:", totalVolume);
      const scoreVolume = parseInt(formatUnits(resRatio[1], Number(decimals)));
      console.log("handleBetAmountChange scoreVolume:", scoreVolume);

      console.log("betAmount:", parseFloat(value));
      if (value === undefined || value === null || value === "") {
        let temp = totalVolume / scoreVolume;
        console.log("temp:", temp);
        if (temp !== temp || temp === Infinity) {
          return setRatio(1);
        }
      }

      if (betAmount === undefined || betAmount === null || betAmount === "") {
        return setRatio(1);
      } else {
        if (scoreVolume === 0 && value == 0) {
          return setRatio(1);
        } else {
          setRatio(totalVolume / parseFloat(value));
        }
        if (totalVolume / parseFloat(value) === Infinity) {
          return setRatio(1);
        }
      }

      setRatio(calculateRatio(totalVolume, scoreVolume, parseFloat(value)));
    } catch (error) {
      console.log("error of getRatio:", error);
    }
  };

  const handleBetScore1Change = async (value: any, stake: any) => {
    console.log("handleBetScore1Change stake: %s value = %s", stake, value);
    setBetScore1(value);
    setSelectedStake(stake);
    let score1 = 0;
    if (value === null || value === undefined || value === "") {
      score1 = 0;
    } else {
      score1 = parseInt(value);
    }

    let score2 = 0;
    if (betScore2 === null || betScore2 === undefined || betScore2 === "") {
      score2 = 0;
    } else {
      score2 = parseInt(betScore2);
    }
    let score = score1 * 10 + score2;
    setExactScore([score1, score2]);
    // console.log("score:", score);

    let decimals = await ChainCode.usdcContract.decimals();
    try {
      let resRatio = await PlaceBet.handleGetRatio(stake, score);
      console.log("resRatio:", formatUnits(resRatio[0], Number(decimals)));
      const totalVolume = parseInt(formatUnits(resRatio[0], Number(decimals)));
      const scoreVolume = parseInt(formatUnits(resRatio[1], Number(decimals)));
      console.log("handleBetScore1Change scoreVolume:", scoreVolume);
      if (value === null || value === undefined || value === "") {
        return setRatio(1);
      }
      if (betAmount === undefined || betAmount === null || betAmount === "") {
        return setRatio(totalVolume / scoreVolume);
      }

      if (scoreVolume === 0) {
        if (betAmount === undefined || betAmount === null || betAmount === "") {
          return setRatio(1);
        }
        if (totalVolume / parseFloat(betAmount) === Infinity) {
          return setRatio(1);
        }
        setRatio(totalVolume / parseFloat(betAmount));
      } else {
        console.log(
          "exact ratio:",
          calculateRatio(totalVolume, scoreVolume, parseFloat(betAmount))
        );
        setRatio(
          calculateRatio(totalVolume, scoreVolume, parseFloat(betAmount))
        );
      }
    } catch (error) {
      console.log("error of getRatio:", error);
    }
  };

  const handleBetScore2Change = async (value: any, stake: any) => {
    console.log("stake:", stake);
    setBetScore2(value);
    setSelectedStake(stake);
    let score1 = 0;
    if (betScore1 === null || betScore1 === undefined || betScore1 === "") {
      score1 = 0;
    } else {
      score1 = parseInt(betScore1);
    }
    let score2 = 0;
    if (value === null || value === undefined || value === "") {
      score2 = 0;
    } else {
      score2 = parseInt(value);
    }
    let score = score1 * 10 + score2;
    setExactScore([score1, score2]);

    let decimals = await ChainCode.usdcContract.decimals();
    try {
      let resRatio = await PlaceBet.handleGetRatio(stake, score);
      console.log("resRatio:", formatUnits(resRatio[0], Number(decimals)));
      const totalVolume = parseInt(formatUnits(resRatio[0], Number(decimals)));
      console.log("totalVolume:", totalVolume);
      const scoreVolume = parseInt(formatUnits(resRatio[1], Number(decimals)));
      console.log("handleBetScore2Change scoreVolume:", scoreVolume);
      console.log("betAmount:", parseFloat(betAmount));
      if (value === null || value === undefined || value === "") {
        return setRatio(1);
      }
      if (betAmount === undefined || betAmount === null || betAmount === "") {
        return setRatio(totalVolume / scoreVolume);
      }
      if (scoreVolume === 0) {
        if (betAmount === undefined || betAmount === null || betAmount === "") {
          return setRatio(1);
        }
        if (totalVolume / parseFloat(betAmount) === Infinity) {
          return setRatio(1);
        }
        setRatio(totalVolume / parseFloat(betAmount));
      } else {
        console.log(
          "exact ratio:",
          calculateRatio(totalVolume, scoreVolume, parseFloat(betAmount))
        );
        setRatio(
          calculateRatio(totalVolume, scoreVolume, parseFloat(betAmount))
        );
      }
    } catch (error) {
      console.log("error of getRatio:", error);
    }
  };

  const handleOptionSelect = (stake: string, type: number) => {
    setSelectedStake(stake);
    setTypeMultiChoice(type);
  };

  const handleAddingBet = async (stake: any, type: any) => {
    setSelectedStake(stake);
    try {
      if (type === "MULTIPLE_CHOICE") {
        if (typeMultiChoice === -1) {
          NotificationManager.warning("Please select an option.", "", 3000);
          return;
        }
        if (betAmount === "" || betAmount === undefined || betAmount === null) {
          return NotificationManager.warning(
            "Please input bet amount.",
            "",
            3000
          );
        }
        const amount = parseFloat(betAmount);
        if (amount <= 0) {
          NotificationManager.warning(
            "Please enter a valid bet amount.",
            "",
            3000
          );
          // alert("Please enter a valid bet amount.");
          return;
        }
        if (!connected) {
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

        await PlaceBet.handleAddingBet(
          selectedStake,
          typeMultiChoice,
          betAmount,
          "USDC" // bettingTokenType
        );

        let resRatios = await PlaceBet.handleGetRatios(stake);
        let decimals = await ChainCode.usdcContract.decimals();
        let tempRatios: any = [
          {
            id: "win",
            rate: parseInt(formatUnits(resRatios[1], Number(decimals))),
          },
          {
            id: "tie",
            rate: parseInt(formatUnits(resRatios[3], Number(decimals))),
          },
          {
            id: "lose",
            rate: parseInt(formatUnits(resRatios[5], Number(decimals))),
          },
        ];

        setRatiosMultiChoice(tempRatios);
      } else {
        if (betAmount === "" || betAmount === undefined || betAmount === null) {
          return NotificationManager.warning(
            "Please input bet amount.",
            "",
            3000
          );
        }
        const amount = parseFloat(betAmount);
        if (amount <= 0) {
          NotificationManager.warning(
            "Please enter a valid bet amount.",
            "",
            3000
          );
          // alert("Please enter a valid bet amount.");
          return;
        }
        if (!connected || !account) {
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

        console.log("score:", betExactScore);
        await PlaceBet.handleExactScoreBet(
          selectedStake,
          betExactScore,
          betAmount
        );
      }

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

  const calculateRatio = (
    totalVolume: any,
    scoreVolume: any,
    inputAmount: any
  ) => {
    return (totalVolume + inputAmount) / (scoreVolume + inputAmount);
  };

  const calculateOdds = (options: any[], volume: any, betAmount: any) => {
    // winner_rate = (amount_1 + amount_2)*(1-fee)/amount_3
    // let tempAmount: any;
    // if (amount === null || amount === undefined || amount === "") {
    //   return 1.0;
    // } else {
    //   tempAmount = parseFloat(amount);
    // }

    // const fee = parseFloat(process.env.REACT_APP_FEE || "0");
    // if (parseFloat(volume) <= 0) {
    //   return 0;
    // }
    let amount;
    if (betAmount === undefined || betAmount === null || betAmount === "") {
      amount = 0;
    } else {
      amount = parseFloat(betAmount);
    }
    if (volume === 0 && amount === 0) {
      return 1;
    }
    const totalAmount = options.reduce((acc, option) => acc + option.rate, 0);
    const totalVolume = totalAmount + amount;
    const winnerOdds = totalVolume / (volume + amount);
    console.log(`${data.name}-winnerOdds:`, winnerOdds);
    if (winnerOdds === Infinity) {
      return 0;
    }
    if (winnerOdds !== winnerOdds) {
      return 0;
    }
    return winnerOdds;
  };

  const getRatiosMultiChoice = async (stake: any) => {
    let decimals = await ChainCode.usdcContract.decimals();
    try {
      let resRatios = await PlaceBet.handleGetRatios(stake);
      let tempRatios: any = [
        {
          id: "win",
          rate: parseInt(formatUnits(resRatios[1], Number(decimals))),
        },
        {
          id: "tie",
          rate: parseInt(formatUnits(resRatios[3], Number(decimals))),
        },
        {
          id: "lose",
          rate: parseInt(formatUnits(resRatios[5], Number(decimals))),
        },
      ];

      console.log(`${data.name}-ratios:`, tempRatios);
      setRatiosMultiChoice(tempRatios);
    } catch (error) {
      console.log("error of getRatiosMultiChoice for each stake:", error);
    }
  };

  const getRatiosScore = async (stake: any) => {
    try {
      let resRatios = await PlaceBet.handleGetRatios(stake);

      let tempArray = [];
      let decimals = await ChainCode.usdcContract.decimals();
      for (let i = 0; i < resRatios.length; i++) {
        const objectRatio = {
          score: parseInt(resRatios[i]),
          volume: parseInt(formatUnits(resRatios[i + 1], Number(decimals))),
        };
        tempArray.push(objectRatio);
        i++;
      }

      setRatioExactScore(tempArray);
      console.log(`${data.name}-exactscore:`, resRatios);
    } catch (error) {
      console.log("error of getRatiosMultiChoice for each stake:", error);
    }
  };

  useEffect(() => {
    if (ChainCode.stakerContracts) {
      if (data?.name !== null || data?.name !== undefined) {
        if (data?.type === "MULTIPLE_CHOICE") {
          getRatiosMultiChoice(data?.name);
        } else {
          getRatiosScore(data?.name);
        }
      }
    }
  }, [ChainCode.stakerContracts]);

  return (
    <SectionEachBet>
      <TextBetGroupName>
        <span>
          {data?.Parties[0]} vs {data?.Parties[1]}&nbsp;&nbsp;
        </span>
        <span style={{ color: "white" }}>
          ( {data?.Date}&nbsp;{data?.Time}&nbsp;{data?.Timezone} )
        </span>
      </TextBetGroupName>
      <SectionBetOptionGroup>
        <SectionEachRow>
          <SectionRowLeft>
            {data?.type === "MULTIPLE_CHOICE" ? (
              <SectionBetEachOption>
                <SectionEachOptionGroup>
                  <button
                    type="button"
                    style={{
                      height: window.innerWidth < 1280 ? "60px" : "40px",
                      borderRadius: "6px",
                    }}
                    className={`btn ${
                      typeMultiChoice === 0
                        ? "btn-primary"
                        : "btn-outline-primary"
                    } w-100 text-white`}
                    onClick={() => handleOptionSelect(data?.name, 0)}
                  >
                    {data?.Parties[0]}
                  </button>
                  <div
                    style={{ borderRadius: "6px" }}
                    className={`w-100 text-center ${
                      typeMultiChoice === 0 ? "bg-warning" : "bg-secondary"
                    } border-secondary border-[12px] mt-1`}
                  >
                    {ratios &&
                      calculateOdds(ratios, ratios[0]?.rate, betAmount).toFixed(
                        2
                      )}
                  </div>
                </SectionEachOptionGroup>
                <SectionEachOptionGroup>
                  <button
                    type="button"
                    style={{
                      height: window.innerWidth < 1280 ? "60px" : "40px",
                      borderRadius: "6px",
                    }}
                    className={`btn ${
                      typeMultiChoice === 1
                        ? "btn-primary"
                        : "btn-outline-primary"
                    } w-100 text-white`}
                    onClick={() => handleOptionSelect(data?.name, 1)}
                  >
                    Tie
                  </button>
                  <div
                    style={{ borderRadius: "6px" }}
                    className={`w-100 text-center ${
                      typeMultiChoice === 1 ? "bg-warning" : "bg-secondary"
                    } border-secondary border-[12px] mt-1`}
                  >
                    {ratios &&
                      calculateOdds(ratios, ratios[1].rate, betAmount).toFixed(
                        2
                      )}
                  </div>
                </SectionEachOptionGroup>
                <SectionEachOptionGroup>
                  <button
                    type="button"
                    style={{
                      height: window.innerWidth < 1280 ? "60px" : "40px",
                      borderRadius: "6px",
                    }}
                    className={`btn ${
                      typeMultiChoice === 2
                        ? "btn-primary"
                        : "btn-outline-primary"
                    } w-100 text-white`}
                    onClick={() => handleOptionSelect(data?.name, 2)}
                  >
                    {data?.Parties[1]}
                  </button>
                  <div
                    style={{ borderRadius: "6px" }}
                    className={`w-100 text-center ${
                      typeMultiChoice === 2 ? "bg-warning" : "bg-secondary"
                    } border-secondary border-[12px] mt-1`}
                  >
                    {ratios &&
                      calculateOdds(ratios, ratios[2].rate, betAmount).toFixed(
                        2
                      )}
                  </div>
                </SectionEachOptionGroup>
              </SectionBetEachOption>
            ) : data?.type === "SCORER" ? (
              <SectionEachScorer>
                <SecitionInputScorer>
                  <InputBetValue
                    component="input"
                    placeholder={data?.Parties[0]}
                    value={betScore1}
                    onChange={(e: any) => {
                      handleBetScore1Change(e.target.value, data?.name);
                    }}
                  />
                </SecitionInputScorer>
                &nbsp;:&nbsp;
                <SecitionInputScorer>
                  <InputBetValue
                    component="input"
                    placeholder={data?.Parties[1]}
                    value={betScore2}
                    onChange={(e: any) => {
                      handleBetScore2Change(e.target.value, data?.name);
                    }}
                  />
                </SecitionInputScorer>
                <SectionScoreRatio>{ratio.toFixed(2)}</SectionScoreRatio>
              </SectionEachScorer>
            ) : (
              <></>
            )}
          </SectionRowLeft>

          <SectionRowRight>
            <SectionInput>
              <InputBetValue
                component="input"
                placeholder="Input bet"
                value={betAmount}
                onChange={(e: any) => {
                  handleBetAmountChange(e.target.value, data?.name);
                }}
              ></InputBetValue>
            </SectionInput>

            <ButtonBet
              // disabled={isProcess}
              isprocess={isProcess ? 1 : 0}
              onClick={() => {
                handleAddingBet(data.name, data.type);
              }}
            >
              {isProcess ? "Processing" : "Place Bet"}
            </ButtonBet>
          </SectionRowRight>
        </SectionEachRow>
      </SectionBetOptionGroup>
    </SectionEachBet>
  );
};

const SectionEachBet = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 30px;
  flex-direction: column;

  @media (max-width: 1280px) {
    margin-top: 0px;
    margin-bottom: 30px;
  }
`;

const TextBetGroupName = styled(Box)`
  display: flex;
  /* text-transform: uppercase; */
  color: #73da13;
  margin-bottom: 5px;
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const SectionBetOptionGroup = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: white;
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
  @media (max-width: 700px) {
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
  @media (max-width: 700px) {
    flex: 1.5;
    width: 100%;
    font-size: 13px;
  }
  @media (max-width: 430px) {
    padding: 0px 15px;
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

const SectionEachRow = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const SectionRowLeft = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
`;

const SectionRowRight = styled(Box)`
  display: flex;
  height: 100%;
  margin-left: 50px;
  align-items: center;
  /* opacity: ${({ active }: any) => (active ? 1 : 0)}; */
  transition: 1s;
  @media (max-width: 1440px) {
    margin-left: 30px;
  }
  @media (max-width: 768px) {
    margin-left: 20px;
  }
  @media (max-width: 700px) {
    margin-left: 0px;
    margin-top: 10px;
    width: 100%;
  }
`;

const SectionEachScorer = styled(Box)`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const SectionScoreRatio = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  aspect-ratio: 1;
  background-color: #6c757d;
  margin-left: 30px;
  border-radius: 12px;
  @media (max-width: 1440px) {
    width: 45px;
  }
  @media (max-width: 768px) {
    width: 35px;
    margin-left: 20px;
  }
  @media (max-width: 500px) {
    width: 35px;
    margin-left: 10px;
  }
`;

const SecitionInputScorer = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
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
    height: 45px;
  }
  @media (max-width: 768px) {
    height: 35px;
    padding: 0px 12px;
    &:hover {
      box-shadow: 0px 0px 6px white;
    }
  }
  @media (max-width: 700px) {
    flex: 3;
    width: 100%;
  }
`;

export default SectionBetGroupDetail;
