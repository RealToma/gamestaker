import { ethers } from "ethers";
import fs from "fs";

import stakerMultiChoiceContractJson from "./abis/SingleStake.sol/SingleStake.json";
import stakerExactScoreContractJson from "./abis/ScoreStake.sol/ScoreStake.json";
import usdcContractJson from "./abis/MyUSDC.sol/MyUSDC.json";
import stakeTreasuryContractJson from "./abis/StakeTreasury.sol/StakeTreasury.json";
import configDataAmoy from "./deployAddresses.amoy.json";
import configDataPolygon from "./deployAddresses.polygon.json";
import fakeApiResponse from "../data/stakerConfig.json";
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
  type: string;
};

export class ChainCode {
  public static INIT : any = false;
  public static WALLET_CONNECTED = false;
  public static chain : string;
  public static accounts : any[] = [];
  public static signer: any;
  public static stakerContracts: Map<string, ethers.Contract> = new Map<string, ethers.Contract>();

  public static usdcContract: any;
  public static stakeTreasuryContract: any;
  public static nfticket: any;
  public static web3provider: ethers.BrowserProvider;
  public static stakes: string[] = [];

  static getStakeInfo(stake: any): any {
    let ret;
    let j = 0;
    for (j = 0; j < fakeApiResponse.length; j++) {
      for (let k = 0; k < fakeApiResponse[j].GAMES.length; k++) {
        let betName = fakeApiResponse[0].GAMES[k].name;
        // console.log("getStakeInfo: comparing %s to %s", betName, stake);
        if (betName === stake) {
          return fakeApiResponse[0].GAMES[k];
        }
      }
    }
    return ret;
  }

  static async initWallet(): Promise<any> {
    ChainCode.web3provider = new ethers.BrowserProvider(
      window?.ethereum as any
    );
    try {
      if (window.ethereum) {
        await window?.ethereum.request({
          method: "eth_requestAccounts",
        });
        let window_accounts : any = await window?.ethereum.request({
          method: "eth_accounts",
        });
        ChainCode.accounts = ( (window_accounts === undefined) ? [] : window_accounts );
        if (window_accounts === undefined) {
           throw new Error("no eth_accounts found");
        } else {
          ChainCode.WALLET_CONNECTED = true;
          // TODO we DO need to set ChainCode.signer to the signer (this is an ethers.js type)
          ChainCode.signer = await ChainCode.web3provider.getSigner(ChainCode.accounts[0]);
        }
      } else {
        throw new Error("no browser EOA wallet found");
      }
    } catch(error) {
      if (error instanceof Error) {
        alert(error.message);
        return Promise.resolve("");
      }
    }
    return Promise.resolve(ChainCode.signer);
  }

  /***
   *
   * @notice here we initialize the smart contracts for the frontend
   *     TODO: this should be a schema or at least JSON with a set of relevant contracts
   * @param signer ethers web3 Signer
   * @return stakerContract
   *
   ***/
  static async initContracts(): Promise<[any, any, any]> {
    let configData: any;
    let signer : any;

    if (this.INIT == false) {
      try {
        signer = await ChainCode.initWallet();
        let chainIDBN: bigint = (await ChainCode.web3provider.getNetwork()).chainId;
        let chainID: number = Number(chainIDBN);
        switch (chainID) {
          case 80002:
            ChainCode.chain = "amoy";
            configData = configDataAmoy;
            break;
          case 137:
            ChainCode.chain = "polygon";
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
      let i = 0;
      availableStakes.forEach(function (availableStake) {
        ChainCode.stakes.push(availableStake.name);
        ChainCode.stakerContracts.set(
          ChainCode.stakes[i++],
          new ethers.Contract(
            availableStake.address,
            availableStake.type === "MULTIPLE_CHOICE"
              ? stakerMultiChoiceContractJson.abi
              : stakerExactScoreContractJson.abi,
            signer
          )
        );
      }); // forEach()

      ChainCode.stakerContracts.forEach((value: any, key: any) => {
          let contract : ethers.Contract = value;
          // console.log("STAKER contracts [%s] = %s", key, contract.target);
      });
      ChainCode.usdcContract = new ethers.Contract(
        usdcContractAddress,
        usdcContractJson.abi,
        signer
      );

      const addressStakeTreasury = configData.TREASURY_ADDRESS;
      ChainCode.stakeTreasuryContract = new ethers.Contract(
        addressStakeTreasury,
        stakeTreasuryContractJson.abi,
        signer
      );
    } 
    return Promise.resolve([
      ChainCode.usdcContract,
      ChainCode.stakeTreasuryContract,
      ChainCode.stakerContracts,
      ]
    );
  } // static async initContracts 
} // class