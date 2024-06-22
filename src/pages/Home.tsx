import "./Home.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import SectionBetGroup from "../components/sections/SectionBetGroup";
import { fakeApiResponse } from "../data/dataAllBets";

export default function SportsBet() {
  const [data, setData] = useState<Array<any>>([]);
  const [indexGroupClicked, setIndexGroupClicked] = useState(-1);

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

  return (
    <StyledComponent>
      <SectionEachBet>
        {data.map((each, index) => {
          return (
            <SectionBetGroup
              key={index}
              data={each}
              index={index}
              indexGroupClicked={indexGroupClicked}
              setIndexGroupClicked={setIndexGroupClicked}
            />
          );
        })}
      </SectionEachBet>
    </StyledComponent>
  );
}

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const SectionEachBet = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
