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
  width: 100%;
  margin-top: 20px;
  margin-bottom: 30px;
  flex-direction: column;

  @media (max-width: 1280px) {
    margin-top: 0px;
    margin-bottom: 30px;
  }
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
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const TextOption = styled(Box)`
  display: flex;
  flex: 1;
  margin-left: 100px;
  @media (max-width: 1440px) {
    margin-left: 70px;
    flex: 0.8;
  }
  @media (max-width: 900px) {
    margin-left: 30px;
    flex: 0.6;
  }
  @media (max-width: 768px) {
    margin-left: 20px;
  }
`;

const TextRatio = styled(Box)`
  display: flex;
  flex: 1;
  margin-left: 50px;
  @media (max-width: 1440px) {
    margin-left: 30px;
    flex: 0.8;
  }
  @media (max-width: 900px) {
    margin-left: 20px;
    flex: 0.6;
  }
  @media (max-width: 768px) {
    margin-left: 20px;
  }
`;

const SectionInput = styled(Box)`
  display: flex;
  flex: 1.5;
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
  @media (max-width: 1280px) {
    height: 35px;
  }
  @media (max-width: 768px) {
    padding: 0px 15px;
    margin-left: 20px;
    flex: 1;
    &:hover {
      box-shadow: 0px 0px 6px white;
    }
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

  @media (max-width: 1440px) {
    font-size: 18px;
  }
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ButtonBet = styled(Box)`
  display: flex;
  justify-content: center;
  padding: 0 40px;
  box-sizing: border-box;
  /* width: 100%; */
  margin-left: 50px;

  height: 40px;
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

  @media (max-width: 1440px) {
    padding: 0 30px;
  }
  @media (max-width: 1280px) {
    padding: 0 25px;
    font-weight: 500;
    font-size: 15px;
    height: 35px;
  }
  @media (max-width: 768px) {
    margin-left: 20px;
  }
`;

export default SectionBetGroup;
