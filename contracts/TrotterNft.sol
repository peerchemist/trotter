// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TrotterNft is ERC1155, AccessControl {
    using SafeMath for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC1155("https://www.trotter.finance/api/NFTs/") {
        _setupRole(MINTER_ROLE, _msgSender());
    }

    struct nftMetadata {
        string name;
        string ipfsHash;
        string price;
    }

    uint256 public cards;
    nftMetadata[] public nfts;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public circulatingSupply;

    event CardAdded(uint256 id, uint256 maxSupply);

    /**
     * @dev Get contract URL
     */
    function contractURI() public view returns (string memory) {
        return string(uri(0));
    }

    /**
     * @notice Creates nft card and mints a new NFT for first time.
     *
     * @param data
              name: Name of new NFT. ipfsHash ipfs hash of nft image the new minted NFT.
              ipfsHash: ipfshash for uploaded media
              price: price for nft
     * @param newOwner Address to mint NFT to.
     * @param maxSupply The max supply of NFT mintable.
     * @param initialSupply The amount of NFT to mint initially.
     */
    function createNftCard(nftMetadata memory data, address newOwner, uint256 maxSupply, uint256 initialSupply) public returns (uint256) {
        require(initialSupply > 0, "Initial supply less than 1");

        uint256 nftId = addCard(maxSupply);
        nfts.push(data);
        mint(newOwner, nftId, initialSupply);

        return nftId;
    }

    /**
     * @notice Creates a new card for unique `NFT`.
     *
     * This signifies each unique NFT,
     *
     * Each NFT can appear more than once, this is where to declare it before minting a copy.
     *
     * The less amount an NFT can be minted determines the value,
     * Low amount of an NFT in circulation makes it rare and more expensive.
     *
     * @param maxSupply The max supply of the NFTs on this card.
     */
    function addCard(uint256 maxSupply) public returns (uint256) {
        require(hasRole(MINTER_ROLE, _msgSender()), "Caller is not a minter");
        require(maxSupply > 0, "Maximum supply can not be 0");
        cards = cards.add(1);
        totalSupply[cards] = maxSupply;
        emit CardAdded(cards, maxSupply);
        return cards;
    }

    /**
     * @notice Mints a new NFT to an NFT card.
     *
     * @param to Address to receive the new minted NFT.
     * @param id The card id to mint NFT from.
     * @param amount The amount of NFT to mint on this card.
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) public {
        require(hasRole(MINTER_ROLE, _msgSender()), "Caller is not a minter");
        require(
            circulatingSupply[id].add(amount) <= totalSupply[id],
            "Total supply reached."
        );

        _mint(to, id, amount, "");
        circulatingSupply[id] = circulatingSupply[id].add(amount);
    }

    /**
     * @notice Burn an NFT from NFT card.
     *
     * @param id The card id to burn NFT from.
     * @param amount The amount of NFT to burn from this card.
     */
    function burn(uint256 id, uint256 amount) public {
        _burn(_msgSender(), id, amount);
        circulatingSupply[id] = circulatingSupply[id].sub(amount);
    }

    /**
     * @dev ERC1155 and AccessControl include supportsInterface so we need to override both
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
