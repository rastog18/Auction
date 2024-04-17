const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AuctionModule", (m) => {

  const auctionContract = m.contract("Auction", [unlockTime], {
    value: lockedAmount,
  });

  return { auctionContract };
});
