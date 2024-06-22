import { ethers } from "ethers";
import Web3 from "web3";
import { ChainCode } from "./web3/chainCode";

export class CashOutClass {
  /*
   ** sc_add (bettingIndex: integer($int32), amount: integer($int256))**
   *
   * Users selects option and adds tokens.
   * Tokens are added to the pool of the selected option.
   * Event handler for submitting the bet
   * This is where the API integration for '/sc_add' occurs
   */
  static cashOut = async (stake: string, wallet: any) => {
    let contract: any = ChainCode.stakerContracts.get(stake);
    if (!(contract === undefined))
      console.log(
        "calling stakerContract which is deployed to %s",
        contract.target
      );
    // let nameBytes16 = ethers.encodeBytes32String(project);

    if (!(contract === undefined)) {
      let tx = await contract.cashOut(wallet);
      await tx.wait();
    }
    // await tx.wait();
    // TODO events

    // await Web3Service.subscribeToEvent(
    // "sc_add"
    // );
  };
}
