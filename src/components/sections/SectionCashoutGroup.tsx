import { Box, Collapse } from "@mui/material";
import styled from "styled-components";

import { useState } from "react";
import { convertStakeDatefromID } from "../../functions/stake";
import ButtonCashOut from "../buttons/ButtonCashOut";
import { RiLogoutBoxLine, RiLogoutBoxRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const SectionCashoutGroup = ({
  data,
  index,
  indexGroupClicked,
  setIndexGroupClicked,
}: any) => {
  const navigate = useNavigate();
  const [clickedExit, setClickedExit] = useState(false);
  console.log("data:", data);
  return (
    <>
      <StyledComponent>
        <SectionBetHeader>
          <ButtonGroupBet
            onClick={() => {
              setClickedExit(true);
              navigate("/");
            }}
          >
            Exit
            {clickedExit ? <RiLogoutBoxLine /> : <RiLogoutBoxRLine />}
          </ButtonGroupBet>
        </SectionBetHeader>
        <Collapse in={!clickedExit}>
          <SectionContent>
            {data?.GAMES?.map((each: any, index: any) => {
              const _index = index;
              return (
                <SectionEachBet key={_index}>
                  <TextBetGroupName>
                    <span>
                      {each?.Parties[0]} vs {each?.Parties[1]}&nbsp;&nbsp;
                    </span>
                    <span style={{ color: "white" }}>
                      ( {each?.Date}&nbsp;{each?.Time}&nbsp;{each?.Timezone} )
                    </span>
                  </TextBetGroupName>
                  <ButtonCashOut stakeID={each.name} />
                </SectionEachBet>
              );
            })}
          </SectionContent>
        </Collapse>
      </StyledComponent>
      <Backdrop open={indexGroupClicked === index ? 1 : 0} />
    </>
  );
};

const Backdrop = styled(Box)<any>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ open }: any) => (!open ? "transparent" : "rgba(0,0,0,.7)")};
  z-index: 54;
  transition: 0.3s;
  transform-origin: center;
  transform: ${({ open }: any) => (!open ? "scale(0)" : "scale(1)")};
`;

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  z-index: 55;

  @media (max-width: 1440px) {
    font-size: 18px;
  }
  @media (max-width: 768px) {
    font-size: 16px;
    font-weight: 500;
  }
`;

const SectionContent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;

  opacity: 1;
  transition: 1s;
`;

const ButtonGroupBet = styled(Box)`
  display: flex;
  /* display: ${({ active }: any) => (active === 1 ? "flex" : "none")}; */
  width: 250px;
  height: 50px;
  padding: 0px 20px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  background-color: #c40632;
  text-transform: uppercase;
  border-radius: 12px;
  cursor: pointer;

  user-select: none;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #c40632;
  }

  @media (max-width: 1440px) {
    width: 200px;
    height: 45px;
    font-size: 18px;
  }
  @media (max-width: 768px) {
    width: 200px;
    height: 35px;
    font-size: 16px;
    padding: 0px 18px;
  }
  @media (max-width: 500px) {
    width: 180px;
    height: 35px;
    font-size: 15px;
    padding: 0px 16px;
  }
`;

const SectionEachBet = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 50px;

  @media (max-width: 1440px) {
    margin-bottom: 35px;
  }
  @media (max-width: 768px) {
    margin-bottom: 25px;
  }
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const TextBetGroupName = styled(Box)`
  display: flex;
  /* text-transform: uppercase; */
  color: #73da13;
  margin-bottom: 5px;
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const SectionBetHeader = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default SectionCashoutGroup;
