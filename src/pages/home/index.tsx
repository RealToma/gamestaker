import { Box } from "@mui/material";
import styled from "styled-components";
import { dataBetGroupList } from "../../data/group";
import SectionBetGroup from "../../components/sections/SectionBetGroup";
import { useState } from "react";

const Home = () => {
  const [indexGroupClicked, setIndexGroupClicked] = useState(-1);

  return (
    <StyledComponent>
      <SectionEachBet>
        {dataBetGroupList.map((each, index) => {
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

export default Home;
