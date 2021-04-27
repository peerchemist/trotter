const TrotterNFTErc721 = artifacts.require("TrotterNFTErc721");

module.exports = async function (deployer, network, [admin]) {
  try {
    await deployer.deploy(TrotterNFTErc721, "http://162.55.50.41:3000/api/nfts/{id}.json");
    const instance = await TrotterNFTErc721.deployed();
    const minterRole = await instance.MINTER_ROLE.call();
    await instance.grantRole(minterRole, admin);
  } catch (error) {
    console.log(error);
  }
};

