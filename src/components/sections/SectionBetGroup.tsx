import { Box, Collapse } from "@mui/material";
import styled from "styled-components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";
import { getGoogleSheetData } from "../../utils/functions";

const SectionBetGroup = ({
  data,
  index,
  indexGroupClicked,
  setIndexGroupClicked,
}: any) => {
  const [flagDown, setFlagDown] = useState(false);
  const handleClickDown = async () => {
    setFlagDown(!flagDown);
    console.log("indexGroupClicked:", indexGroupClicked);
    if (indexGroupClicked === index) {
      setIndexGroupClicked(-1);
      return;
    }
    setIndexGroupClicked(index);

    await getGoogleSheetData();
  };

  return (
    <StyledComponent>
      <ButtonGroupBet onClick={() => handleClickDown()}>
        <span> {data.groupName}</span>
        {!flagDown ? <FaChevronDown /> : <FaChevronUp />}
      </ButtonGroupBet>
      <Collapse in={indexGroupClicked === index ? true : false}>
        <SectionContent>
          {data?.groupBets.map((each: any, index: any) => {
            return (
              <SectionEachBet key={index}>
                <TextBetGroupName>
                  {each.groupBetName}&nbsp;&nbsp;{each.betBefore}
                </TextBetGroupName>
                <SectionBetOptionGroup>
                  {each.options.map((each: any) => {
                    return (
                      <SectionEachOption>
                        <TextOption>{each.optionName}</TextOption>
                        <TextRatio>Ratio: {each.ratio}</TextRatio>
                        <SectionInput>
                          <InputBetValue
                            component="input"
                            placeholder="Input token amount"
                          ></InputBetValue>
                        </SectionInput>
                        <ButtonBet>Bet</ButtonBet>
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
  /* text-transform: uppercase; */
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
  margin-top: 15px;
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
  flex: 1;
  width: 100%;
  margin-left: 50px;
  background-color: white;
  border-radius: 20px;
  height: 50px;
  padding: 0px 20px;
  box-sizing: border-box;

  transition: 0.3s;
  &:hover {
    box-shadow: 0px 0px 10px white;
  }
`;

const InputBetValue = styled(Box)`
  display: flex;
  width: 100%;
  border: none;
  outline: none;

  color: black;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
`;

const ButtonBet = styled(Box)`
  display: flex;
  flex: 0.5;
  width: 100%;
  margin-left: 50px;

  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #48b415;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;

  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #48b415;
  }
`;

export default SectionBetGroup;
