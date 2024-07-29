import "./Oracle.css";
import Modal from "react-bootstrap/Modal";
import React, { useCallback, useEffect, useState } from "react";
import { OracleClass } from "../Oracle";
import { ChainCode } from "../web3/chainCode";
import { fakeApiResponse } from "../data/dataAllBets";

export default function Oracle() {
  const [data, setData] = useState<Array<any>>([]);
  const [show, setShow] = useState(false);
  const [selectedStake, setSelectedStake] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>("");
  const [bettingTokenType, setBettingTokenType] = useState<string>("");

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

  /*
   ** sc_solve (winningIndex: integer($int32))**
   *
   * Post result, only owner.
   * Tokens from the not winning options get distributed to the bet winners.
   * Protocol owners also cash in fees. Example, winner option 2 out of 3.
   * winner_rate = (amount_1 + amount_2)*(1-fee)/amount_3
   * This is where the API integration for '/sc_solve' occurs
   */
  const handleResolveBet = async () => {
    console.log(
      `Winning option Index: ${selectedOption} selected stake: ${selectedStake}`
    );
    // TODO initializing the chain objects should be done once per session
    let [staker, usdc] = await ChainCode.initContracts();
    await OracleClass.resolveBet(selectedStake, selectedOption);
    console.log(`winning Index: ${selectedOption}`);

    // await Web3Service.subscribeToEvent(
    // "sc_solve"
    // );
  };

  const handleOptionSelect = (stake: string, optionIndex: number) => {
    setSelectedStake(stake);
    setSelectedOption(optionIndex);
  };

  return (
    <div key="app" className="App">
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
            key="resolveGame"
            className="row col-lg-3 offset-lg-1 col-12 d-flex gx-2"
          >
            <div key="confirm" className="col-auto">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleResolveBet}
              >
                Resolve Game
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
