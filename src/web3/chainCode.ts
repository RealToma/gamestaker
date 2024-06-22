import { ethers } from "ethers";
import fs from "fs";

import stakerContractJson from "./abis/SingleStake.sol/SingleStake.json";
import usdcContractJson from "./abis/MyUSDC.sol/MyUSDC.json";
import stakeTreasuryContractJson from "./abis/StakeTreasury.json";
import configDataAmoy from "./deployAddresses.amoy.json";
import configDataPolygon from "./deployAddresses.polygon.json";
import { EventClassFactory } from "./eventSubscription";
import * as Events from "./events.types";

export enum stakeStatus {
  "INIT",
  "START",
  "CLOSE",
}

export type stakerContract = {
  name: string;
  address: string; // 40-bit address of smart contract in Hex
  status: stakeStatus; // lifecycle status of stake
};

export class ChainCode {
  public static signer: any;
  public static stakerContracts: Map<string, ethers.Contract>;
  public static usdcContract: any;
  public static stakeTreasuryContract: any;
  public static nfticket: any;
  public static web3provider: ethers.BrowserProvider;
  public static stakes: string[];

  static async initWallet(): Promise<string[]> {
    ChainCode.stakerContracts = new Map<string, ethers.Contract>();
    ChainCode.web3provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    // TODO Thomas - if you don't want to call initWallet() you DO need to set ChainCode.signer to the signer (this is an ethers.js type)
    ChainCode.signer = await ChainCode.web3provider.getSigner(accounts[0]);
    return Promise.resolve(accounts);
  }

  /***
   *
   * @notice here we initialize the smart contracts for the frontend
   *     TODO: this should be a schema or at least JSON with a set of relevant contracts
   * @param signer ethers web3 Signer
   * @return stakerContract
   *
   ***/
  static async initContracts(signer: any): Promise<[any, any, any]> {
    let chain: string = "";
    let configData: any;

    try {
      let chainIDBN: bigint = (await ChainCode.web3provider.getNetwork())
        .chainId;
      let chainID: number = Number(chainIDBN);
      switch (chainID) {
        case 80002:
          chain = "amoy";
          configData = configDataAmoy;

          break;
        case 137:
          chain = "polygon";
          configData = configDataPolygon;
          break;
        default:
          throw new Error("invalid chainID `${chainID}`");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        Promise.resolve([]);
      }
    }
    const usdcContractAddress = configData.myUSDC;

    let availableStakes: stakerContract[] = configData.STAKER_ADDRESSES;
    availableStakes.forEach(function (availableStake) {
      console.log(
        "processing stake %s with adress %s",
        availableStake.name,
        availableStake.address
      );
      ChainCode.stakerContracts.set(
        availableStake.name,
        new ethers.Contract(
          availableStake.address,
          stakerContractJson.abi,
          signer
        )
      );
    }); // forEach()

    ChainCode.usdcContract = new ethers.Contract(
      usdcContractAddress,
      usdcContractJson.abi,
      signer
    );
    console.log(
      "usdcContract address is %s",
      await ChainCode.usdcContract.getAddress()
    );

    const addressStakeTreasury = configData.TREASURY_ADDRESS;
    ChainCode.stakeTreasuryContract = new ethers.Contract(
      addressStakeTreasury,
      stakeTreasuryContractJson.abi,
      signer
    );

    console.log(
      "stakeTreasuryContract address is %s",
      await ChainCode.stakeTreasuryContract.getAddress()
    );
    return Promise.resolve([
      ChainCode.usdcContract,
      ChainCode.stakeTreasuryContract,
      availableStakes,
    ]);
  }
}
