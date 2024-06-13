import axios from "axios";

export const getGoogleSheetData = async () => {
  try {
    const spreadsheetId = process.env.REACT_APP_ID_GOOGLE_SHEET_GAMESTAKER;
    const sheetName = "Test01"; // Replace with the name of your sheet
    const apiKey = process.env.REACT_APP_API_GOOGLE_SHEET;

    const response = await axios.get(`https://sheetdb.io/api/v1/l2oum3pq88qs5`);
    console.log("dataSheet:", response.data);

    const betEach = {
      groupName: "",
      groupBets: [] as any,
    };

    const groupBets = {
      groupBetName: "",
      betBefore: "",
      options: [] as any,
    };

    const betOption = {
      optionName: "",
      ratio: 1,
    };
    const arrayGroupBets = [];
    const arrayOptions = [] as any;
    let tempGroupName;
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i]["Red Groups"] !== "") {
        tempGroupName = response.data[i]["Red Groups"];
        let tempGroupBetName;
        let tempBetBefore;
        i++;
        if (response.data[i]["Text"] !== "") {
          console.log("texts:", i);
          tempGroupBetName = response.data[i]["Text"];
          tempBetBefore = response.data[i]["Bet Before"];
          i++;
          if (response.data[i]["Options"] !== "") {
            betOption.optionName = response.data[i]["Options"];
            betOption.ratio = response.data[i]["Ratio"];
            arrayOptions.push(betOption);
          }

          groupBets.groupBetName = tempGroupBetName;
          groupBets.betBefore = tempBetBefore;
          groupBets.options = arrayOptions;
        }
        betEach.groupName = tempGroupName;
        betEach.groupBets.push(groupBets);
      }
      //   arrayGroupBets.push(betEach);
    }
    // console.log("arrayGroupBets:", arrayGroupBets);
    // if (dataSheet.length !== 0) {
    //   console.log("dataSheet:", dataSheet);
    // } else {
    //   console.log("No sheet data found.");
    // }
  } catch (error) {
    console.log("Google Sheet Error:", error);
  }
};
