import { parseUnits } from 'ethers';
import Web3 from "web3";
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
    const fee = parseFloat(process.env.REACT_APP_FEE || '0');
    const totalAmount = options.reduce((acc, option) => acc + option.amount, 0);
    const nonWinnerAmount = totalAmount - amount;
    const winnerOdds = (nonWinnerAmount * (1 - fee)) / amount;
    return winnerOdds;
  }

  /*
  ** sc_add (bettingIndex: integer($int32), amount: integer($int256))**
  * 
  * Users selects option and adds tokens. 
  * Tokens are added to the pool of the selected option.
  * Event handler for submitting the bet
  * This is where the API integration for '/sc_add' occurs
  */
  static handleAddingBet = async (selectedStake: any, selectedOption: any, betAmount: any, bettingTokenType: any) => {
    if (selectedOption === null) {
      alert("Please select an option.");
      return;
    }

    const myUSDC = process.env.REACT_APP_USDC_ADDRESS;
    const amount = parseInt(betAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    let stake = parseUnits(betAmount, 6);
    console.log(`Betting option Index: ${selectedOption}`);
    console.log(`Betting amount: ${stake}`);
    console.log(`Token Type: ${bettingTokenType}`);


    console.log("calling usdcContract which is deployed to %s", await ChainCode.usdcContract.getAddress());

    let contract = ChainCode.stakerContracts.get(selectedStake);
    if ( ! ( contract === undefined ) ) {

      let allowance = await ChainCode.usdcContract.allowance(ChainCode.signer.getAddress(), contract.target);
      
      var tx : any;
      if ( allowance < stake ) {
        tx = await ChainCode.usdcContract.approve(contract.target, stake);
        await tx.wait();
      }


      console.log("calling stakerContract which is deployed to %s", contract.target);
      tx = await contract.create_stake(selectedOption, myUSDC, stake);
      await tx.wait();
    }
    // TODO events


    // await Web3Service.subscribeToEvent(
    // "sc_add"
    // );

  };

  
}
