const { ethers } = require("ethers");
const ftsoRewardManagerAbi = require("./songbird/FtsoRewardManager.json");
const ftsoManagerAbi = require("./songbird/FtsoManager.json");
const ftsoAbi = require("./songbird/Ftso.json");
const ftsoList = require("./assets/ftsoList.json");

const provider = new ethers.providers.JsonRpcProvider({
  url: "https://songbird-api.flare.network/ext/C/rpc",
  timeout: 60000,
});

const firstEpochTs = 1631824801;
const submitPeriod = 180;
const revealPeriod = 90;
var timestamp = Math.round(Date.now() / 1000);
var currentEpoch = 0;
var currentRewardEpoch = 0;
var epochEndTs = 0;
var timeTillSubmitEnd = 0;
var timeTillRevealEnd = 0;
var lastFinalizedEpoch = 0;
var rewardsDistributed = { epoch: null, addresses: null, rewards: null };

setInterval(() => {
  // console.log({
  //   timestamp,
  //   epochEndTs,
  //   timeTillSubmitEnd,
  //   timeTillFinalization,
  //   finalizationEndTs,
  //   currentEpoch,
  // });
}, 1000);

function updateData() {
  timestamp = Math.round(Date.now() / 1000);
  currentEpoch = Math.floor((timestamp - firstEpochTs) / submitPeriod);
  epochEndTs = getEpochEndTime();
  finalizationEndTs = getFinalizationEndTime();
  timeTillSubmitEnd = epochEndTs - timestamp;
  timeTillRevealEnd = finalizationEndTs - timestamp;
}

function getEpochEndTime() {
  const startingEpoch =
    Math.floor((timestamp - firstEpochTs) / submitPeriod) + 1;
  return startingEpoch * submitPeriod + firstEpochTs;
}
function getFinalizationEndTime() {
  const startingEpoch = Math.floor((timestamp - firstEpochTs) / submitPeriod);
  return startingEpoch * submitPeriod + revealPeriod + firstEpochTs;
}
function getTimeTillSubmit() {
  return this.getEpochEndSeconds() - this.submitOffset;
}

let nulled;
//
const ftsoRewardManagerContract = new ethers.Contract(
  "0xc5738334b972745067fFa666040fdeADc66Cb925",
  ftsoRewardManagerAbi,
  provider
);
const ftsoManagerContract = new ethers.Contract(
  "0xbfA12e4E1411B62EdA8B035d71735667422A6A9e",
  ftsoManagerAbi,
  provider
);
const sgbContract = new ethers.Contract(
  "0x23f1AaA1B6a5fD5bbB5906Fa389D517C870CA2FF",
  ftsoAbi,
  provider
);
(async () => {
  currentRewardEpoch = await ftsoManagerContract.getCurrentRewardEpoch();

  ftsoManagerContract.on("PriceEpochFinalized", (address, epoch, event) => {
    console.log(`${address} ${epoch}`);
  });
  ftsoRewardManagerContract.on(
    "RewardsDistributed",
    (address, epoch, addresses, rewards) => {
      console.log(`Epoch: ${epoch} - ${address}`);
      console.log("Rewarded Addresses:", addresses);
      console.log("Rewards:", rewards);

      rewardsDistributed.epoch = epoch;
      rewardsDistributed.addresses = addresses;
      rewardsDistributed.rewards = rewards;
    }
  );
})();

module.exports = {
  submit: async function () {
    console.log(ftsoRewardManagerAbi);
    let currentBlock = await provider.getBlockNumber();
    console.log(currentBlock);
  },
  getSgbPrice: async function () {
    return await sgbContract.getCurrentPrice();
  },
  getData: function () {
    updateData();
    return {
      timestamp,
      epochEndTs,
      timeTillSubmitEnd,
      timeTillRevealEnd,
      finalizationEndTs,
      currentEpoch,
      rewardsDistributed,
    };
  },
  getUserRewards: async function (address) {
    return await ftsoRewardManagerContract.getStateOfRewards(
      address,
      currentRewardEpoch
    );
  },
  getDataProviderEmblem: function (address) {
    for (let ftso of ftsoList.providers) {
      if (ftso.address.toLowerCase() == address.toLowerCase()) {
        return ftso.logoURI;
      }
    }
    return "https://cdn.flaremetrics.io/flare/ftso/emblem/unknown@64.png";
  },
};
