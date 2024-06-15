import { ethers } from "hardhat";
import { expect } from "chai";
import { config as dotEnvConfig } from "dotenv";
import { BigNumber, Wallet } from "ethers";
import fs from "fs";
import { WAGR } from "../../typechain-types/WAGR";
import { MyUSDC } from "../../typechain-types/MyUSDC";
import { SingleStake } from "../../typechain-types/SingleStake";
import { StakeTreasury } from "../../typechain-types/StakeTreasury";
import { string } from "hardhat/internal/core/params/argumentTypes";


let staker: any;
let treasury : StakeTreasury;
let erc1: WAGR, erc2: WAGR, erc3: WAGR;
let myUSDC: MyUSDC;
let deployer: any;
let staker1, staker2, staker3 :any;
let rcpt1, rcpt2, rcpt3 : any;
let addrs: any;

// @notice 32 chars as per 15*2 (UTF16/two-byte Umlaut) + 1 ASCII (single-byte) character plus trailing \0
let projectName = "ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜI"; 
let dummyBLXM = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let dummyNFTicket = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
let decimals = 18;
let usdcDecimals = 6;
let _budget = String(15000);
let budget : BigNumber = ethers.utils.parseUnits(_budget, usdcDecimals);
let options : BigNumber = BigNumber.from(3); // ethers.utils.parseUnits(String(3), decimals);
let erc20Options : string[];

describe("SingleStaker test suite", () => {

  /*** 
  const myConfigFileName = "./deployAddresses.".concat(network.name).concat(".json");
  const configData = JSON.parse(fs.readFileSync(myConfigFileName));
  const STAKER_ADDRESS = configData.STAKER_ADDRESS;
  const USDC_ADDRESS = configData.myAAA;
  const TOKEN_B_ADDRESS = configData.myBBB;
  const UNISWAP_V2_ROUTER02_ADDRESS = process.env.UNISWAP_V2_ROUTER02_ADDRESS || "";
  const MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY || "";
  const GOERLI_SCAN_API_KEY = process.env.GOERLI_SCAN_API_KEY || "";

  ***/
  before(async function () {

       /******** START prepare wallets ****************
     * master is the main address deploying the contracts and signing the transactions
     * addr2 and addr3 are used to receive NFTicket
     * 
     ******************************************/
    [deployer, staker1, staker2, staker3, rcpt1, rcpt2, rcpt3, ...addrs] = await ethers.getSigners();     

    const ManagerLibFactory = await ethers.getContractFactory('ManagerLib');
    let ManagerLib = await ManagerLibFactory.deploy();
    await ManagerLib.deployed();
    console.log('ManagerLib deployed to:', ManagerLib.address);

    let myUSDCFactory = await ethers.getContractFactory("MyUSDC");
    let wagrFactory = await ethers.getContractFactory("WAGR");
    let treasuryFactory = await ethers.getContractFactory("StakeTreasury");
    let stakerFactory = await ethers.getContractFactory("SingleStake", 
        {
            libraries: {
                ManagerLib: ManagerLib.address
            },
        }
    );
    
    let i : number = 0;
    erc1 = await wagrFactory.deploy("ERC1") as WAGR;
    erc2 = await wagrFactory.deploy("ERC2") as WAGR;
    erc3 = await wagrFactory.deploy("ERC3") as WAGR;

    erc20Options = [erc1.address, erc2.address, erc3.address];

    myUSDC = await myUSDCFactory.deploy() as MyUSDC;

    treasury = await treasuryFactory.deploy() as StakeTreasury;

    console.log('treasury deployed to:', treasury.address);


    let nameBytes32 = ethers.utils.formatBytes32String(projectName);
    console.log("retrieved project name is %s", ethers.utils.parseBytes32String(nameBytes32));

    // nameBytes32 = stringToHex(taskArgs.name);
    console.log("deploying with %s %s %s %s %s", myUSDC.address, dummyNFTicket, treasury.address, nameBytes32, options);
    staker = await stakerFactory.deploy(
        nameBytes32, 
        myUSDC.address, 
        dummyNFTicket, 
        treasury.address, 
        options
    ) as SingleStake;
});

describe("Section 1: initialize contracts and provide stable coin supply", function() {

    it("    Test Case 1: contract addresses", 
        async function () {
            console.log("deployed staker to %s", staker.address);
            console.log("deployed USDC to %s",  myUSDC.address);
            console.log("deployed WAGR1 to %s", erc1.address);
            console.log("deployed WAGR2 to %s", erc2.address);
            console.log("deployed WAGR3 to %s", erc3.address);
        }
    );

    it("    Test case 2: interconnect contracts in the suite",
        async function () {
            let templateInitTreasury = {
                manager: deployer.address
            };
            await treasury.init(templateInitTreasury);
            await treasury.registerStaker(staker.address);
        }
    );

    it("    Test case 3: mint 15,000 USDC to deployer wallet",
        async function () {
            let initialBalance : BigNumber = await myUSDC.balanceOf(deployer.address);
            await myUSDC.mint(deployer.address, budget)
            expect(await myUSDC.balanceOf(deployer.address)).to.equal(initialBalance.add(budget));
        }
    );
});

describe("Section 2: place bets", function() {

    it("    Test case 1: mint 15,000 USDC to deployer and stakers' wallet",
        async function () {
            let initialBalance : BigNumber = await myUSDC.balanceOf(deployer.address);
            await myUSDC.mint(deployer.address, budget)
            expect(await myUSDC.balanceOf(deployer.address)).to.equal(initialBalance.add(budget));

            await myUSDC.mint(staker1.address, budget)
            expect(await myUSDC.balanceOf(staker1.address)).to.equal(budget);
            await myUSDC.mint(staker2.address, budget)
            expect(await myUSDC.balanceOf(staker2.address)).to.equal(budget);
            await myUSDC.mint(staker3.address, budget)
            expect(await myUSDC.balanceOf(staker3.address)).to.equal(budget);


        }
    );

    it("    Test case 2: add stakes",
    /***
     * 
     event TokensWagered(
        bytes32 indexed _name, 
        uint option, 
        address indexed lpToken, 
        uint256 indexed totalLP);
     * 
     ***/
        async function () {
            let stake0 = (budget.mul(3)).div(6);
            let stake1 = (budget.mul(2)).div(6);
            let stake2 = (budget.mul(1)).div(6);

            let option = 0; // @notice home team wins
            await expect(
                staker.create_stake(option, erc1.address, stake0)
            ).to.be.revertedWith("this token is not accepted here");

            let tx = await myUSDC.connect(staker1).approve(staker.address, stake0);
            let receipt = await tx.wait();
            let allowance = await myUSDC.connect(staker1).allowance(staker1.address, staker.address);
            console.log("allowance staker1 =%s", allowance);
            tx = await staker.connect(staker1).create_stake(option, myUSDC.address, stake0);

            option = 1; // @notice tie
            tx = await myUSDC.connect(staker2).approve(staker.address, stake1);
            receipt = await tx.wait();
            allowance = await myUSDC.connect(staker2).allowance(staker2.address, staker.address);
            console.log("allowance staker2 =%s", allowance);
            tx = await staker.connect(staker2).create_stake(option, myUSDC.address, stake1);

            option = 2; // @notice visiting team wins
            tx = await myUSDC.connect(staker3).approve(staker.address, stake2);
            receipt = await tx.wait();
            allowance = await myUSDC.connect(staker3).allowance(staker3.address, staker.address);
            console.log("allowance staker1 =%s", allowance);
            tx = await staker.connect(staker3).create_stake(option, myUSDC.address, stake2);
        }
    );
        
    it("Test case 3: verifying balances after staking",
        async function () 
        {
            let stake0 = (budget.mul(3)).div(6);
            let stake1 = (budget.mul(2)).div(6);
            let stake2 = (budget.mul(1)).div(6);
            
            let balance : BigNumber = await myUSDC.balanceOf(staker1.address);
            expect(await
                myUSDC.balanceOf(staker1.address)
            ).to.equal(budget.sub(stake0));

            balance = await myUSDC.balanceOf(staker2.address);
            expect(await
                myUSDC.balanceOf(staker2.address)
            ).to.equal(budget.sub(stake1));

            balance = await myUSDC.balanceOf(staker3.address);
            expect(await
                myUSDC.balanceOf(staker3.address)
            ).to.equal(budget.sub(stake2));
        }
    );

    it("    Test case 4: try cashing out early",
        async function () {
            await expect(staker.cashOut(rcpt1.address)).to.be.revertedWith("winner not yet determined");
        }
    );
});

describe ("Section 3: decide outcome",
    async function () {
        it("    Test case 1: it's a tie",
            async function () {
                await staker.setWinner(1);
            }
        );
        it("    Test case 2: cash out",
            async function () {
                await expect(staker.connect(staker1).cashOut(rcpt1.address))
                    .to.be.revertedWith("you have no stake in the winning option");
                await staker.connect(staker2).cashOut(rcpt2.address);
                console.log("we won %s USDC", await myUSDC.balanceOf(rcpt2.address));
            })
    }
);

});
