import { parseUnits } from "ethers";
import { ChainCode } from "./web3/chainCode";

export class PlaceBet {
  /*
   ** sc_read ()**
   *
   * Fetching options data from the '/sc_read' API on component mount
   * returns balance of different option pools
   * This is where the API integration for '/sc_read' occurs
   */

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
    let stake = parseUnits(betAmount, 6);
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
      // if (allowance >= stake) {
      //   return NotificationManager.warning(
      //     `Bet amount should be less than allowance(${parseUnits(
      //       allowance,
      //       6
      //     )}USDC).`,
      //     "",
      //     5000
      //   );
      // }
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
    let stake = parseUnits(betAmount, 6);
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
