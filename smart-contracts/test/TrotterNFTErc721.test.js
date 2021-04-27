const TrotterNFTErc721 = artifacts.require('TrotterNFTErc721');
const truffleAssert = require('truffle-assertions');

contract('TrotterNFTErc721', async (accounts) => {
  const nftDummyData = ['big nft', 'QmaZgH4KJT2xZxxPETuUnBvn3aDnEUgjUNwftfA4gk3RSG', 001, 'Chris', 'new', '', '',
    accounts[2]];
  
  it('Sets minter', async () => {
    const instance = await TrotterNFTErc721.deployed();
    const minterRole = await instance.MINTER_ROLE.call();
    await instance.grantRole(minterRole, accounts[1]);
    const [acc1, acc2] = await Promise.all([
      instance.hasRole.call(minterRole, accounts[1]),
      instance.hasRole.call(minterRole, accounts[2]),
    ]);
    assert.equal(true, acc1);
    assert.equal(false, acc2);
  });

  it('Only minter can create token', async () => {
    const instance = await TrotterNFTErc721.deployed();
    await instance.createNft(...nftDummyData, { from: accounts[1] });
    await truffleAssert.reverts(instance.createNft(...nftDummyData, { from: accounts[2] }));
    const created = await instance.nftIds.call();
    assert.equal(1, created.toNumber());
  });

  it('Burn functions correctly', async () => {
    const instance = await TrotterNFTErc721.deployed();
    let balance = await instance.balanceOf(accounts[2]);
    assert.equal(1, balance.toNumber());
    await instance.burn(1, { from: accounts[2] });
    await truffleAssert.reverts(instance.burn(1, { from: accounts[2] }));
    await truffleAssert.reverts(instance.burn(1, { from: accounts[1] }));
    // check balance
    balance = await instance.balanceOf(accounts[2]);
    assert.equal(0, balance.toNumber());
  });
});
