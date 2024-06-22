import { ethers } from "ethers";
import { getProperty, setProperty } from "../helpers/reflexion";


export type Events = 
  TokensWagered
 ;

abstract class web3Event {
  public className: string;
  public filter: any;
  public topic : any;
  constructor(contractAddress: any, className: string, topic: any) {
    this.className = className; 
    this.topic = topic;
    this.filter = {
      address: contractAddress,
      topics: [
        this.topic
      ]
    };
    console.log("instantiating web3Event[%s]", this.className);
  }
  public initialize(eventLog : any)
  {
    let k : keyof this;
    Object.keys(this).forEach(key => {
      let [type, value] = getProperty(eventLog,key);
      k = key as keyof this;
      if ( (key !== "className") && (key !== "topic") && (key !== "filter")) {
        this[k] = value;
        console.log("%s[%s]=%s", this.className, key, value);
      }
    });
  } // initializeEvent
  public getTopics() : string[] {
    let ret : string[] = [];
    let k : keyof this;
    Object.keys(this).forEach(key => {
      k = key as keyof this;
      if ( (key !== "className") && (key !== "topic") && (key !== "filter")) {
        ret.push(key);
      }
    });
    return(ret);
  }
}

/*
  event TokensWagered(
        bytes32 indexed _name, 
        uint option, 
        address indexed lpToken, 
        uint256 indexed totalLP
    );
*/
export class TokensWagered extends web3Event{
  _name: any;
  option: any;
  lpToken: any;
  totalLP: any;
  constructor(contractAddress: any) {
    super(
      contractAddress, 
      "EventTokensWagered", 
      "_name,option,lpToken, totalLP"
    );
  }
}


