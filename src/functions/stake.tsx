export const convertStakeDatefromID = (nameBet: any) => {
  const tempDateString = nameBet?.slice(-6);
  return (
    tempDateString.slice(4, 6) +
    "/" +
    tempDateString.slice(2, 4) +
    "/" +
    "20" +
    tempDateString.slice(0, 2)
  );
};
