import { Box, Collapse } from "@mui/material";
import styled from "styled-components";
import { RiLogoutBoxRLine, RiLogoutBoxLine } from "react-icons/ri";

import { NotificationManager } from "react-notifications";
import { useAccount } from "wagmi";
import { ChainCode } from "../../web3/chainCode";
import SectionBetGroupDetail from "./SectionBetGroupDetail";
import { useSDK } from "@metamask/sdk-react";
// import { getGoogleSheetData } from "../../utils/functions";

const SectionBetGroup = ({
  data,
  index,
  indexGroupClicked,
  setIndexGroupClicked,
}: any) => {
  const { connected } = useSDK();

  const handleClickDown = async () => {
    if (!connected ) {
      return NotificationManager.warning("Connect your wallet.", "", 3000);
    }
    try {
      await ChainCode.initWallet();
      await ChainCode.initContracts(ChainCode.signer);
    } catch (error: any) {
      console.log("error of initContracts:", error);
      NotificationManager.error(error.reason, "", 5000);
    }
    if (indexGroupClicked === index) {
      setIndexGroupClicked(-1);
      return;
    }
    setIndexGroupClicked(index);
  };

  return (
    <>
      <StyledComponent>
        <SectionBetHeader>
          <ButtonGroupBet onClick={() => handleClickDown()}>
            <span>{data.TOURNAMENT}</span>
            {indexGroupClicked === index ? (
              <RiLogoutBoxLine />
            ) : (
              <RiLogoutBoxRLine />
            )}
          </ButtonGroupBet>
        </SectionBetHeader>

        <Collapse in={indexGroupClicked === index ? true : false}>
          <SectionContent active={indexGroupClicked === index ? 1 : 0}>
            {data?.["GAMES"].map((each: any, index: any) => {
              const _index = index;
              return <SectionBetGroupDetail data={each} key={_index} />;
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

  opacity: ${({ active }: any) => (active ? 1 : 0)};
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
    width: 230px;
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
    height: 35px;
    font-size: 15px;
    padding: 0px 16px;
  }
`;

const SectionBetHeader = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default SectionBetGroup;
