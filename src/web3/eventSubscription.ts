import Web3 from "web3";
import { Contract, ContractEventName, ethers } from "ethers";
import { AlchemyProvider } from '@ethersproject/providers';

import { ChainCode } from "./chainCode";
import { Events } from "./events.types";


declare var window: any;
const { ethereum } = window;

export class EventClassFactory {

  static getEventClass(eventName: string) : string {
    return("Event".concat(eventName));
  }
  

  static createEventClass(contractAddress: any, eventName: string) : Events {
    let className : any = EventClassFactory.getEventClass(eventName);
      return className(contractAddress);
  }

  /********
     * 
     * @notice This function handles the web3 subscription to smart contract event(s).
     * After this step, a smart contract event can be caught and the corresponding callback function
     * to execute can be found and executed. 
     * 
     ********/
   static subscribeToEvent = async (
    contractName: string,
    contractAddress: any,
    contractAbi: any,
    eventName: string,
    latestBlock: any,
    eventCallback: (log: any) => boolean
  ) => {
    let provider: any;
    /// @notice we use a JSON RPC - future TODO WebSocket - provider here, as opposed to the provider given by windows.ethereum
    if ( ( process.env.REACT_APP_NETWORK == "goerli" ) && (process.env.REACT_APP_ALCHEMY_API_KEY != null)) { // goerli
      provider = new AlchemyProvider('goerli', process.env.REACT_APP_ALCHEMY_API_KEY);
    } else
    {
      provider = ChainCode.web3provider;
    }
    console.log("chain is %s", process.env.REACT_APP_NETWORK);
    console.log("we are on chainID=%s", process.env.REACT_APP_NETWORK);

    /************
     * 
     *  @notice Here be MaJicK...
          event classes are automatically generated based on the "topic description" we provide in events.types,
          e.g.:
          All we do need to is to provide 
          1. the field names:
          `class EventMileageUpdated extends web3Event {
            ticketID: any;
            from: any;
            to: any;
            timestamp: any;..`
          2. the Solidity signature with Event name and data type for each field.
                `this.topic = ethers.utils.id("MileageUpdated(uint256,uint256,uint256,uint256)");`
          Everything else happens automatically.
          NOTE Events.w3Event is a placeholder "union" which is never actually instantiated.
          Which class is actually created, is determined dynamically by the EventClass Factory:
            `let thisEvent : Events.w3Event = EventClassFactory.createEventClass(contractAddress, "MileageUpdated")`
              will dynamically instantiate thisEvent as an instance typeof Events.EventMileageUpdated
      * 
     ************/
    let thisEvent : Events = EventClassFactory.createEventClass(contractAddress, eventName);

    console.log("subscribe to event[%s] topic[%s]", thisEvent?.className, thisEvent?.topic);

    const contract = new Contract(contractAddress, contractAbi, provider);
    if (eventName == "TokensWagered") {
      let abi = ["event TokensWagered(bytes32 indexed _name, uint option, address indexed lpToken, uint256 indexed totalLP)"];
      contract.on(eventName as ContractEventName, thisEvent?.filter);
      eventCallback(thisEvent);
    }
  }
}
