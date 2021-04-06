const TrotterNFT = artifacts.require("TrotterNFT");
const truffleAssert = require("truffle-assertions");

contract("TrotterNFT", async (accounts) => {
  it("Returns correct Metadata", async () => {
    const instance = await TrotterNFT.deployed();
    const contractMetadata = await instance.contractURI.call();
    
    assert.equal(
      contractMetadata,
      "https://www.trotter.finance/api/NFTs/"
    );
  });

  it("Sets minter", async () => {
    const instance = await TrotterNFT.deployed();
    const minterRole = await instance.MINTER_ROLE.call();
    await instance.grantRole(minterRole, accounts[1]);
    const [acc1, acc2] = await Promise.all([
      instance.hasRole.call(minterRole, accounts[1]),
      instance.hasRole.call(minterRole, accounts[2]),
    ]);
    assert.equal(true, acc1);
    assert.equal(false, acc2);
  });

  it("Only minter can create token", async () => {
    const instance = await TrotterNFT.deployed();
    await instance.addCard(1, { from: accounts[1] });
    await truffleAssert.reverts(instance.addCard(1, { from: accounts[2] }));
    await truffleAssert.reverts(instance.addCard(0, { from: accounts[1] }));
    const created = await instance.cards.call();
    assert.equal(1, created.toNumber());
  });

  it("Cannot mint more than max supply", async () => {
    const instance = await TrotterNFT.deployed();
    await instance.addCard(5, { from: accounts[1] });
    const cardID = await instance.cards.call();
    await instance.mint(accounts[2], cardID.toNumber(), 3, {
      from: accounts[1],
    });
    await truffleAssert.reverts(
      instance.mint(accounts[2], cardID.toNumber(), 3, { from: accounts[1] })
    );
    await truffleAssert.reverts(
      instance.mint(accounts[2], cardID.toNumber(), 1, { from: accounts[2] })
    );
    await instance.mint(accounts[2], cardID.toNumber(), 2, {
      from: accounts[1],
    });
    await truffleAssert.reverts(
      instance.mint(accounts[2], cardID.toNumber(), 1, { from: accounts[1] })
    );
  });

  it("Burn functions correctly", async () => {
    const instance = await TrotterNFT.deployed();
    let balance = await instance.balanceOf(accounts[2], 2);
    assert.equal(5, balance.toNumber());
    await instance.burn(2, 4, { from: accounts[2] });
    await truffleAssert.reverts(instance.burn(2, 4, { from: accounts[2] }));
    await truffleAssert.reverts(instance.burn(2, 1, { from: accounts[1] }));
    // check balance
    balance = await instance.balanceOf(accounts[2], 2);
    assert.equal(1, balance.toNumber());
    // check circulating
    circulatingSupply = await instance.circulatingSupply(2);
    assert.equal(1, circulatingSupply.toNumber());
  });

  it("Create function works", async () => {
    const instance = await TrotterNFT.deployed();
    const minterRole = await instance.MINTER_ROLE.call();
    await instance.grantRole(minterRole, accounts[1]);

    await instance.createNftCard('big nft', "QmaZgH4KJT2xZxxPETuUnBvn3aDnEUgjUNwftfA4gk3RSG", 001, accounts[3], 10, 1, { from: accounts[1] });
    let balance = await instance.balanceOf(accounts[3], 3);
    assert.equal(1, balance.toNumber());
  });
});
