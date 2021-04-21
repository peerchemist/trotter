const TrotterNft = artifacts.require("TrotterNft");

module.exports = async function (deployer, network, [admin]) {
  try {
    await deployer.deploy(TrotterNft);
    const instance = await TrotterNft.deployed();
    await instance.initialize();
    const minterRole = await instance.MINTER_ROLE.call();
    await instance.grantRole(minterRole, admin);
  } catch (error) {
    console.log(error);
  }
};

