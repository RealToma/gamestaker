import "./Home.css";
import Modal from "react-bootstrap/Modal";
import React, { useCallback, useEffect, useState } from "react";
import { ethers, parseUnits } from "ethers";
import Web3 from "web3";
import { ChainCode, stakeStatus, stakerContract } from "../web3/chainCode";
import { PlaceBet } from "../PlaceBet";

const fakeApiResponse = [
  {
    title: "Football",
    id: "Football",
    subtitles: [
      {
        id: "SloUkr240621",
        options: [
          { id: "option0", optionIndex: 0, amount: 2, name: "Slovakia" },
          { id: "option1", optionIndex: 1, amount: 3, name: "tie" },
          { id: "option2", optionIndex: 2, amount: 15, name: "Ukraine" },
        ],
        text: "Slovakia vs. Ukraine",
        // TODO time: '13/04/24 19:00 CET'
      },
      {
        id: "PorCze240618",
        options: [
          { id: "option0", optionIndex: 3, amount: 2, name: "Portugal" },
          { id: "option1", optionIndex: 4, amount: 3, name: "tie" },
          { id: "option2", optionIndex: 5, amount: 15, name: "Czech" },
        ],
        text: "Portugal vs. Czech Republic",
        // TODO time: '13/04/24 19:00 CET'
      },
      {
        id: "AutFra240617",
        options: [
          { id: "option0", optionIndex: 6, amount: 2, name: "Austria" },
          { id: "option1", optionIndex: 7, amount: 3, name: "tie" },
          { id: "option2", optionIndex: 8, amount: 15, name: "France" },
        ],
        text: "Austria vs. France",
        // TODO time: '13/04/24 19:00 CET'
      },
      {
        id: "CroAlb240619",
        options: [
          { id: "option0", optionIndex: 9, amount: 2, name: "Croatia" },
          { id: "option1", optionIndex: 10, amount: 3, name: "tie" },
          { id: "option2", optionIndex: 11, amount: 15, name: "Albania" },
        ],
        text: "Croatia vs. Albania",
        // TODO time: '13/04/24 19:00 CET'
      },
      {
        id: "HolFra240621",
        options: [
          { id: "option0", optionIndex: 12, amount: 2, name: "Netherlands" },
          { id: "option1", optionIndex: 13, amount: 3, name: "tie" },
          { id: "option2", optionIndex: 14, amount: 15, name: "France" },
        ],
        text: "Netherlands vs. France",
        // TODO time: '13/04/24 19:00 CET'
      },
      {
        id: "PolAut240621",
        options: [
          { id: "option0", optionIndex: 15, amount: 2, name: "Poland" },
          { id: "option1", optionIndex: 16, amount: 3, name: "tie" },
          { id: "option2", optionIndex: 17, amount: 15, name: "Austria" },
        ],
        text: "Poland vs. Austria",
        // TODO time: '13/04/24 19:00 CET'
      },
    ],
  },
  // Additional sections can be added here
];

export default function SportsBet() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [walletBalance, setWalletBalance] = useState("0");

  const [data, setData] = useState<Array<any>>([]);
  const [show, setShow] = useState(false);
  const [selectedStake, setSelectedStake] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>("");
  const [bettingTokenType, setBettingTokenType] = useState<string>("");

  const connectToMetaMask = async () => {
    try {
      var usdcContract: any;
      // var stakerContracts : Map<string, ethers.Contract>;
      var stakerContracts: any;
      if (window.ethereum) {
        let accounts = await ChainCode.initWallet();
        let address = await ChainCode.signer.getAddress();
        setIsConnected(true);
        let myAccount: any = accounts[0] as string;
        setAccount(myAccount);

        const web3 = new Web3(window.ethereum);

        const chainID = await web3.eth.net.getId();
        const balance = await web3.eth.getBalance(accounts[0]);
        const balanceString = web3.utils.fromWei(balance, "ether");
        console.log(
          "wallet %s on network %s has balance %s",
          address,
          chainID,
          balanceString
        );
        setWalletBalance(balanceString);

        [usdcContract, stakerContracts] = await ChainCode.initContracts(
          ChainCode.signer
        );
        for (let stake of stakerContracts.values()) {
          console.log("received stake[%s]=%s", stake.name, stake.address);
        }
      } else {
        console.log("MetaMask is not installed");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
    console.log("usdcContract is deployed to %s", usdcContract.target);
  };

  /*
   ** sc_add (bettingIndex: integer($int32), amount: integer($int256))**
   *
   * Users selects option and adds tokens.
   * Tokens are added to the pool of the selected option.
   * Event handler for submitting the bet
   * This is where the API integration for '/sc_add' occurs
   */
  const handleAddingBet = async () => {
    if (selectedOption === null) {
      alert("Please select an option.");
      return;
    }
    await PlaceBet.handleAddingBet(
      selectedStake,
      selectedOption,
      betAmount,
      bettingTokenType
    );
  };

  /*
   ** sc_read ()**
   *
   * Fetching options data from the '/sc_read' API on component mount
   * returns balance of different option pools
   * This is where the API integration for '/sc_read' occurs
   */
  useEffect(() => {
    const fetchReadBalance = async () => {
      // Read SC
      const res = fakeApiResponse;
      callBackReadBalance(res);
    };

    fetchReadBalance();
  }, []);

  const callBackReadBalance = (data: any) => {
    setData(data);
  };

  const calculateOdds = (options: any[], amount: number) => {
    // winner_rate = (amount_1 + amount_2)*(1-fee)/amount_3
    const fee = parseFloat(process.env.REACT_APP_FEE || "0");
    const totalAmount = options.reduce((acc, option) => acc + option.amount, 0);
    const nonWinnerAmount = totalAmount - amount;
    const winnerOdds = (nonWinnerAmount * (1 - fee)) / amount;
    return winnerOdds;
  };

  const handleOptionSelect = (stake: string, optionIndex: number) => {
    setSelectedStake(stake);
    setSelectedOption(optionIndex);
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleTokenTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBettingTokenType(e.target.value);
  };

  return (
    <div key="app" className="App">
      <div key="buttons1" className="d-flex justify-content-end p-5 w-100">
        <div key="divShow">
          <button
            key="btnShow"
            type="button"
            className="btn btn-link color-secondary px-4"
            onClick={() => setShow(true)}
          >
            DOC
          </button>
        </div>
        <div key="divWallet" className="">
          <button
            key="btnWallet"
            type="button"
            className="btn btn-primary"
            onClick={connectToMetaMask}
          >
            Connect Wallet
          </button>
        </div>
      </div>
      <div key="showGames" className="container-fluid p-lg-5 p-4">
        <div key="row1" className="row">
          <div key="row11" className="col-lg-8 col-12">
            {data.map((section: any, index: any) => (
              <>
                <h2 key="row11h2" className="m-3 mt-0 px-4">
                  {section.title}
                </h2>
                <div key="showOptions" className="container my-4">
                  {section.subtitles.map((subtitle: any, index: any) => (
                    <div key={subtitle.id} className="row mx-lg-5 mx-2 mb-3">
                      <h3 key={subtitle.text} className="mb-2">
                        {subtitle.text}{" "}
                      </h3>
                      <p>{subtitle.time}</p>
                      <div className="row mb-2">
                        <div className="row col-12">
                          {subtitle.options.map((option: any, idx: any) => (
                            <div key={option.id} className="col-4">
                              <button
                                key={option.name}
                                type="button"
                                className={`btn ${
                                  selectedOption === option.optionIndex
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                                } w-100`}
                                onClick={() =>
                                  handleOptionSelect(
                                    subtitle.id,
                                    option.optionIndex
                                  )
                                }
                              >
                                {option.name}
                              </button>
                              <div
                                key={option.amount}
                                className="w-100 text-center bg-warning border-secondary mt-1"
                              >
                                {calculateOdds(
                                  subtitle.options,
                                  option.amount
                                ).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>

          <div
            key="setBet"
            className="row col-lg-3 offset-lg-1 col-12 d-flex gx-2"
          >
            <div key="betAmount" className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Input bet"
                value={betAmount}
                onChange={handleBetAmountChange}
              />
            </div>

            <div key="betERC20" className="col">
              <select
                className="form-control"
                value={bettingTokenType}
                onChange={handleTokenTypeChange}
              >
                <option key="ask" value="">
                  Choose TOKEN...
                </option>
                <option key="USDC" value="USDC">
                  USDC
                </option>
                <option key="USDT" value="USDT">
                  USDT
                </option>
              </select>
            </div>
            <div key="confirm" className="col-auto">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddingBet}
              >
                Place Bet
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        size="lg"
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title key="modaltitle" id="example-custom-modal-styling-title">
            DOC PDF Template
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div key="modalbody">
            <iframe
              key="myframe"
              title="myframe"
              src="https://docs.google.com/viewer?url=http://www.africau.edu/images/default/sample.pdf&embedded=true"
              frameBorder="0"
              height="500px"
              width="100%"
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
