import { parseUnits } from 'ethers';
import Web3 from "web3";
import { ChainCode } from "./web3/chainCode";

export class OracleClass {

  
  
  /*
  ** sc_add (bettingIndex: integer($int32), amount: integer($int256))**
  * 
  * Users selects option and adds tokens. 
  * Tokens are added to the pool of the selected option.
  * Event handler for submitting the bet
  * This is where the API integration for '/sc_add' occurs
  */
  static resolveBet = async (stake: string, selectedOption: any) => {
    if (selectedOption === null) {
      alert("Please select an option.");
      return;
    }

    let contract = ChainCode.stakerContracts.get(stake);
    if ( ! ( contract === undefined ) ) {
      console.log(
        "calling stakerContract which is deployed to %s with stake=%s and option=%s", 
        contract.target,
        stake, 
        selectedOption
      );
      await contract.setWinner(selectedOption);
    }
    // TODO events


    // await Web3Service.subscribeToEvent(
    // "sc_add"
    // );

  };

  
}
