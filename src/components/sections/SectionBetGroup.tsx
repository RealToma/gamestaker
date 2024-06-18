import { Box, Collapse } from "@mui/material";
import styled from "styled-components";
import { RiLogoutBoxRLine, RiLogoutBoxLine } from "react-icons/ri";

import SectionEachOption from "./SectionEachOption";
// import { getGoogleSheetData } from "../../utils/functions";

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
    // await getGoogleSheetData();
  };

  return (
    <>
      <StyledComponent>
        <ButtonGroupBet onClick={() => handleClickDown()}>
          <span> {data.groupName}</span>
          {indexGroupClicked === index ? (
            <RiLogoutBoxLine />
          ) : (
            <RiLogoutBoxRLine />
          )}
        </ButtonGroupBet>
        <Collapse in={indexGroupClicked === index ? true : false}>
          <SectionContent>
            {data?.groupBets.map((each: any, index: any) => {
              const _index = index;
              return (
                <SectionEachBet key={_index}>
                  <TextBetGroupName>
                    {each.groupBetName}&nbsp;&nbsp;{each.betBefore}
                  </TextBetGroupName>
                  <SectionBetOptionGroup>
                    {each.options.map((each: any, index: any) => {
                      const __index = index;
                      return <SectionEachOption key={__index} each={each} />;
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
  color: #73da13;
`;

const SectionBetOptionGroup = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: white;
`;

export default SectionBetGroup;
