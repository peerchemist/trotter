const TrotterNFTErc721 = artifacts.require("TrotterNFTErc721");

module.exports = async function (deployer, network, [admin]) {
  try {
    await deployer.deploy(TrotterNFTErc721);
    const instance = await TrotterNFTErc721.deployed();
    await instance.initialize();
    const minterRole = await instance.MINTER_ROLE.call();
    await instance.grantRole(minterRole, admin);
  } catch (error) {
    console.log(error);
  }
};

