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
      <Collapse in={flagDown ? true : false}>
        <SectionContent>
          {data?.groupBet.map((each: any, index: any) => {
            return (
              <SectionEachBet key={index}>
                <TextBetGroupName>
                  {each.groupBetName}&nbsp;&nbsp;{"<BET BEFORE>"}
                </TextBetGroupName>
                <SectionBetOptionGroup>
                  {each.groupBetList.map((each: any, index: any) => {
                    return (
                      <SectionEachOption>
                        <TextOption>{each.optionName}</TextOption>
                        <TextRatio>{each.ratio}</TextRatio>
                        <SectionInput>{each.optionName}</SectionInput>
                        <ButtonBet>{each.optionName}</ButtonBet>
                      </SectionEachOption>
                    );
                  })}
                </SectionBetOptionGroup>
              </SectionEachBet>
            );
          })}
        </SectionContent>
      </Collapse>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
`;

const SectionContent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
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

const SectionEachBet = styled(Box)`
  display: flex;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  flex-direction: column;
`;

const TextBetGroupName = styled(Box)`
  text-transform: uppercase;
  color: white;
`;

const SectionBetOptionGroup = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const SectionEachOption = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 10px;
  align-items: center;
`;

const TextOption = styled(Box)`
  display: flex;
  flex: 1;
  margin-left: 150px;
`;

const TextRatio = styled(Box)`
  display: flex;
  flex: 1;
  margin-left: 50px;
`;

const SectionInput = styled(Box)`
  display: flex;
  flex: 2;
  width: 100%;
  margin-left: 50px;
`;

const ButtonBet = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  margin-left: 50px;
`;

export default SectionBetGroup;
