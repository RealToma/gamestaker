import styled from "styled-components";
import { Box } from "@mui/material";
import { useContext, useState } from "react";
import { RefContext } from "../hooks/RefContext";
import SectionCashoutGroup from "../components/sections/SectionCashoutGroup";

const MyBets = () => {
  const { arrayMyBets }: any = useContext(RefContext);
  const [indexGroupClicked, setIndexGroupClicked] = useState(0);

  return (
    <StyledComponent>
      <SectionEachBet>
        {arrayMyBets?.map((each: any, index: any) => {
          return (
            <SectionCashoutGroup
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
};

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

export default MyBets;
