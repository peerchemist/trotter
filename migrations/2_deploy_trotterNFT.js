const TrotterNFT = artifacts.require("TrotterNFT");

module.exports = function (deployer) {
  deployer.deploy(TrotterNFT);
};
