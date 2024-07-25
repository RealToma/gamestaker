import { parseUnits } from "ethers";
import { ChainCode } from "./web3/chainCode";

export class PlaceBet {

  static getOptionInfo(stakeInfo : any, option: any) : string {

   let _option : number = Number(option);
   console.log("option is %s", _option);
   let test = 3;
   if(stakeInfo.type == "MULTIPLE_CHOICE") {
    switch(_option) {
      case 0:
        return(stakeInfo.Parties[0]);
        break;
      case 1:
        return "TIE";
        break;
      case 2:
        return(stakeInfo.Parties[1]);
        break;
    }
   } else if (stakeInfo.type == "SCORER") {
      let _first : string = String(Math.floor(Number(_option) / 10));
      let _second : string = String(Number(_option) % 10);
      return(_first.concat(":").concat(_second));
    }
    return "";
  }
  static calculateOdds = (options: any[], amount: number) => {
    // winner_rate = (amount_1 + amount_2)*(1-fee)/amount_3
    const fee = parseFloat(process.env.REACT_APP_FEE || "0");
    const totalAmount = options.reduce((acc, option) => acc + option.amount, 0);
    const nonWinnerAmount = totalAmount - amount;
    const winnerOdds = (nonWinnerAmount * (1 - fee)) / amount;
    return winnerOdds;
  };

  /*
   ** sc_add (bettingIndex: integer($int32), amount: integer($int256))**
   *
   * Users selects option and adds tokens.
   * Tokens are added to the pool of the selected option.
   * Event handler for submitting the bet
   * This is where the API integration for '/sc_add' occurs
   */
  static handleAddingBet = async (
    selectedStake: any,
    selectedOption: any,
    betAmount: any,
    bettingTokenType: any
  ) => {
    let decimals = await ChainCode.usdcContract.decimals();
    let stake = parseUnits(betAmount, Number(decimals));
    console.log(`Betting option Index: ${selectedOption}`);
    console.log(`Betting amount: ${stake}`);
    console.log(`Token Type: ${bettingTokenType}`);

    const myUSDC = await ChainCode.usdcContract.getAddress();

    console.log("calling usdcContract which is deployed to %s", myUSDC);

    let contract = ChainCode.stakerContracts.get(selectedStake);
    if (!(contract === undefined)) {
      let allowance = await ChainCode.usdcContract.allowance(
        ChainCode.signer.getAddress(),
        contract.target
      );

      console.log("allowance:", allowance);

      var tx: any;
      if (parseInt(allowance) < stake) {
        tx = await ChainCode.usdcContract.approve(contract.target, stake);
        await tx.wait();
      }

      console.log(
        "calling stakerContract which is deployed to %s",
        contract.target
      );
      tx = await contract.create_stake(selectedOption, myUSDC, stake);
      await tx.wait();
      // @dev can return before resolved : await tx.wait();
    }
    // TODO events

    // await Web3Service.subscribeToEvent(
    // "sc_add"
    // );
  };

  static handleExactScoreBet = async (
    selectedStake: any,
    score: any,
    betAmount: any
  ) => {
    let decimals = await ChainCode.usdcContract.decimals();
    let stake = parseUnits(betAmount, Number(decimals));
    const myUSDC = await ChainCode.usdcContract.getAddress();

    console.log("calling usdcContract which is deployed to %s", myUSDC);

    let contract = ChainCode.stakerContracts.get(selectedStake);
    if (!(contract === undefined)) {
      let allowance = await ChainCode.usdcContract.allowance(
        ChainCode.signer.getAddress(),
        contract.target
      );

      console.log("allowance:", allowance);

      var tx: any;
      if (parseInt(allowance) < stake) {
        tx = await ChainCode.usdcContract.approve(contract.target, stake);
        await tx.wait();
      }

      console.log(
        "calling stakerContract which is deployed to %s",
        contract.target
      );
      tx = await contract.predict_score(score, myUSDC, stake);
      await tx.wait();
    }
  };

  static handleGetStakes = async (walletAddress: any) => {
    let resGetStakes = await ChainCode.stakeTreasuryContract.getStakes(
      walletAddress
    );
    return resGetStakes;
  };

  static handleGetRatio = async (selectedStake: any, score: any) => {
    let contract = ChainCode.stakerContracts.get(selectedStake);

    if (!(contract === undefined)) {
      let resRatio = await contract.getRatio(score);
      console.log("resRatio:", resRatio);
      return resRatio;
    }
  };

  static handleGetRatios = async (selectedStake: any) => {
    let contract = ChainCode.stakerContracts.get(selectedStake);
    if (!(contract === undefined)) {
      let resRatio = await contract.getRatios();
      return resRatio;
    }
  };
}
