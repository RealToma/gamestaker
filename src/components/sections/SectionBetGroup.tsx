import { Box, Collapse } from "@mui/material";
import styled from "styled-components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";

const SectionBetGroup = ({
  data,
  index,
  indexGroupClicked,
  setIndexGroupClicked,
}: any) => {
  const [flagDown, setFlagDown] = useState(false);
  const handleClickDown = () => {
    setFlagDown(!flagDown);
    console.log("indexGroupClicked:", indexGroupClicked);
    if (indexGroupClicked === index) {
      setIndexGroupClicked(-1);
      return;
    }
    setIndexGroupClicked(index);
  };

  return (
    <StyledComponent>
      <ButtonGroupBet onClick={() => handleClickDown()}>
        <span> {data.groupName}</span>
        {!flagDown ? <FaChevronDown /> : <FaChevronUp />}
      </ButtonGroupBet>
      <Collapse in={indexGroupClicked === index ? true : false}>
        <SectionContent>{data.groupName}</SectionContent>
      </Collapse>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const SectionContent = styled(Box)`
  display: flex;
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
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
  border-radius: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  user-select: none;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #c40632;
  }
`;

export default SectionBetGroup;
