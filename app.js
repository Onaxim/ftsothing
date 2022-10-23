const { ethers } = require("ethers");
const ftsoRewardManagerAbi = require("./songbird/FtsoRewardManager.json");
const ftsoManagerAbi = [
  {
    type: "event",
    name: "PriceEpochFinalized",
    inputs: [
      {
        type: "address",
        name: "chosenFtso",
        internalType: "address",
        indexed: false,
      },
      {
        type: "uint256",
        name: "rewardEpochId",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
];

const provider = new ethers.providers.JsonRpcProvider({
  url: "https://sgb.ftso.com.au/ext/bc/C/rpc",
  timeout: 60000,
});
(async () => {
  // const ftsoRewardManagerContract = new ethers.Contract(
  //   "0xc5738334b972745067fFa666040fdeADc66Cb925",
  //   ftsoRewardManagerAbi,
  //   provider
  // );
})();

function submit() {}

module.exports = {
  submit: async function () {
    console.log("run from library");
    let currentBlock = await provider.getBlockNumber();
    console.log(currentBlock);
  },
};
