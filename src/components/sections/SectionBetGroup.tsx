import { Box, Collapse } from "@mui/material";
import styled from "styled-components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getGoogleSheetData } from "../../utils/functions";

const SectionBetGroup = ({
  data,
  index,
  indexGroupClicked,
  setIndexGroupClicked,
}: any) => {
  const handleClickDown = async () => {
    if (indexGroupClicked === index) {
      setIndexGroupClicked(-1);
      return;
    }
    setIndexGroupClicked(index);

    await getGoogleSheetData();
  };

  return (
    <>
      <StyledComponent>
        <ButtonGroupBet onClick={() => handleClickDown()}>
          <span> {data.groupName}</span>
          {indexGroupClicked === index ? <FaChevronUp /> : <FaChevronDown />}
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
  background: ${({ open }: any) => (!open ? "transparent" : "rgba(0,0,0,.6)")};
  z-index: 9;
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
  z-index: 10;
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
  background-color: #272727;
  border-radius: 20px;
  height: 40px;
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
  background-color: #272727;
  color: white;
  font-family: "Inter";
  font-weight: 500;
  font-size: 20px;
`;

const ButtonBet = styled(Box)`
  display: flex;
  padding: 0 40px;
  /* width: 100%; */
  margin-left: 50px;

  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: #48b415;
  color: white;
  font-family: "Inter";
  font-weight: 600;
  font-size: 16px;
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
