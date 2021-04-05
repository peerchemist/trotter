const TrotterNft = artifacts.require("TrotterNft");

module.exports = function (deployer) {
  deployer.deploy(TrotterNft);
};

