const TrotterNft = artifacts.require("TrotterNft");
const TrotterNFTErc721 = artifacts.require("TrotterNFTErc721");

module.exports = async function (deployer, network, [admin]) {
  try {
    await deployer.deploy(TrotterNft);
    const instance = await TrotterNft.deployed();
    await instance.initialize();
    const minterRole = await instance.MINTER_ROLE.call();
    await instance.grantRole(minterRole, admin);

    await deployer.deploy(TrotterNFTErc721);
    const instance2 = await TrotterNFTErc721.deployed();
    await instance2.initialize();
    const minterRole2 = await instance2.MINTER_ROLE.call();
    await instance2.grantRole(minterRole2, admin);
  } catch (error) {
    console.log(error);
  }
};

