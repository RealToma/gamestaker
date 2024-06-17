import axios from "axios";
import { ethers, formatUnits } from "ethers";
import abiStakeJson from "../web3/abis/SingleStake.sol/SingleStake.json";
import abiMyUSDCJson from "../web3/abis/MyUSDC.sol/MyUSDC.json";
import { addressDeployContracts } from "../web3/addressDeployContracts";

const abiStakeContract = abiStakeJson.abi;
const abiMyUSDCContract = abiMyUSDCJson.abi;

const provider = new ethers.InfuraProvider(
  process.env.REACT_APP_ENABLE_TESTNET === "true" ? "matic-amoy" : "matic",
  process.env.REACT_APP_KEY_INFRA
);

const contractMyUSDC = new ethers.Contract(
  addressDeployContracts.myUSDC,
  abiMyUSDCContract,
  provider
);

const contractStake = new ethers.Contract(
  addressDeployContracts.STAKER_ADDRESS,
  abiStakeContract,
  provider
);

export const getMyBalance = async (address: any) => {
  try {
    const resPolygonBalance = await provider.getBalance(address);
    const balancePolygon: any = parseFloat(formatUnits(resPolygonBalance, 6));
    console.log("balance of polygon:", balancePolygon);

    const resMyUSDC = await contractMyUSDC.balanceOf(address);

    const balanceMyUSDC: any = parseFloat(formatUnits(resMyUSDC, 6));
    console.log("balance of myUsdc:", balanceMyUSDC);

    return { balancePolygon: balancePolygon, balanceMyUSDC: balanceMyUSDC };
  } catch (error) {
    console.log("error of getMyBalance", error);
  }
};

export const getGoogleSheetData = async () => {
  try {
    const spreadsheetId = process.env.REACT_APP_ID_GOOGLE_SHEET_GAMESTAKER;
    const sheetName = "Test01"; // Replace with the name of your sheet
    const apiKey = process.env.REACT_APP_API_GOOGLE_SHEET;

    const response = await axios.get(`https://sheetdb.io/api/v1/l2oum3pq88qs5`);
    console.log("dataSheet:", response.data);

    const betEach = {
      groupName: "",
      groupBets: [] as any,
    };

    const groupBets = {
      groupBetName: "",
      betBefore: "",
      options: [] as any,
    };

    const betOption = {
      optionName: "",
      ratio: 1,
    };
    const arrayGroupBets = [];
    const arrayOptions = [] as any;
    let tempGroupName;
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i]["Red Groups"] !== "") {
        tempGroupName = response.data[i]["Red Groups"];
        let tempGroupBetName;
        let tempBetBefore;
        i++;
        if (response.data[i]["Text"] !== "") {
          console.log("texts:", i);
          tempGroupBetName = response.data[i]["Text"];
          tempBetBefore = response.data[i]["Bet Before"];
          i++;
          if (response.data[i]["Options"] !== "") {
            betOption.optionName = response.data[i]["Options"];
            betOption.ratio = response.data[i]["Ratio"];
            arrayOptions.push(betOption);
          }

          groupBets.groupBetName = tempGroupBetName;
          groupBets.betBefore = tempBetBefore;
          groupBets.options = arrayOptions;
        }
        betEach.groupName = tempGroupName;
        betEach.groupBets.push(groupBets);
      }
      //   arrayGroupBets.push(betEach);
    }
    // console.log("arrayGroupBets:", arrayGroupBets);
    // if (dataSheet.length !== 0) {
    //   console.log("dataSheet:", dataSheet);
    // } else {
    //   console.log("No sheet data found.");
    // }
  } catch (error) {
    console.log("Google Sheet Error:", error);
  }
};
