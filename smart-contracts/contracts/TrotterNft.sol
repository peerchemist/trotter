// SPDX-License-Identifier: MIT
pragma solidity =0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TrotterNft is ERC1155, AccessControl {
    using SafeMath for uint256;

    constructor() ERC1155("https://www.trotter.finance/api/NFTs/") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Contract name
    string public name = "Finite";
    // Contract symbol
    string public symbol = "FNT";

    struct nftMetadata {
        uint256 nftID;
        string name;
        string ipfsHash;
        uint256 price;
        string author;
        string about;
        string properties;
        string statement;
    }

    uint256 public cards;
    nftMetadata[] public nfts;
    mapping(uint256 => nftMetadata) public getNft;
    mapping(uint256 => address[]) public nftOwners;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public circulatingSupply;
    // nftid ==> edition id ==> owner
    mapping(uint256 => mapping(uint256 => address)) public editions;

    event CardAdded(uint256 id, uint256 maxSupply);

    /**
    * @dev Require msg.sender to own editions
    */
    modifier ownEditions(uint256 nftId, uint256[] memory _editions) {
        for (uint256 index = 1; index < _editions.length; index++) {
            string memory _res = string(abi.encodePacked("ERC1155#notEditionOwner: you do not own this edition", _editions[index]));
            require(editions[nftId][_editions[index]] != msg.sender, _res);
        }
        _;
    }

    /**
     * @notice Creates nft card and mints a new NFT for first time.
     *
     * @param _name Name of nft
     * @param _ipfsHash Ipfs Hash of nft media
     * @param _price Price of nft (in eth)
     * @param _author Author of nft
     * @param _about More details about nft
     * @param _properties Properties details about nft
     * @param _statement Any statement details about nft
     * @param _newOwner Address to mint NFT to.
     * @param _maxSupply The max supply of NFT mintable.
     * @param _initialSupply The amount of NFT to mint initially.
     */
    function createNftCard(
        string memory _name,
        string memory _ipfsHash,
        uint256 _price,
        string memory _author,
        string memory _about,
        string memory _properties,
        string memory _statement,
        address _newOwner,
        uint256 _maxSupply,
        uint256 _initialSupply
    ) public returns (uint256) {
        require(_initialSupply > 0, "Initial supply less than 1");
        uint256 nftId = addCard(_maxSupply);

        nftMetadata memory data = nftMetadata({
            nftID: nftId,
            name: _name,
            ipfsHash: _ipfsHash,
            price: _price,
            author: _author,
            about: _about,
            properties: _properties,
            statement: _statement
        });

        nfts.push(data);
        getNft[nftId] = data;

        mint(_newOwner, nftId, _initialSupply);
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
     * @param _maxSupply The max supply of the NFTs on this card.
     */
    function addCard(uint256 _maxSupply) public returns (uint256) {
        require(hasRole(MINTER_ROLE, _msgSender()), "Caller is not a minter");
        require(_maxSupply > 0, "Maximum supply can not be 0");
        cards = cards.add(1);
        totalSupply[cards] = _maxSupply;
        emit CardAdded(cards, _maxSupply);
        return cards;
    }

    /**
     * @notice Mints a new NFT to an NFT card.
     *
     * @param _to Address to receive the new minted NFT.
     * @param _id The card id to mint NFT from.
     * @param _amount The amount of NFT to mint on this card.
     */
    function mint(
        address _to,
        uint256 _id,
        uint256 _amount
    ) public {
        require(hasRole(MINTER_ROLE, _msgSender()), "Caller is not a minter");
        require(
            circulatingSupply[_id].add(_amount) <= totalSupply[_id],
            "Total supply reached."
        );

        _mint(_to, _id, _amount, "");
        nftOwners[_id].push(_to);

        // create editions
        for (uint256 index = 1; index <= _amount; index++) {
            circulatingSupply[_id] = circulatingSupply[_id].add(1);
            editions[_id][circulatingSupply[_id]] = _to;
        }
    }

    /**
     * @notice Burn an NFT from NFT card.
     *
     * @param _id The card id to burn NFT from.
     * @param _editions The editions of NFT to burn from this card.
     */
    function burn(uint256 _id, uint256[] memory _editions) public ownEditions(_id, _editions) {
        address sender = _msgSender();
        _burn(sender, _id, _editions.length);

        delete getNft[_id];
        for (uint256 index = 0; index < nfts.length; index++) {
            if(nftOwners[_id][index] == sender) {
                nftOwners[_id][index] = nftOwners[_id][nftOwners[_id].length];
                nftOwners[_id].pop();
                break;
            }
        }

        // delete editions
        for (uint256 index = 1; index <= _editions.length; index++) {
            delete editions[_id][_editions[index]];
            circulatingSupply[_id] = circulatingSupply[_id].sub(1);
        }
    }

    /**
     * @notice Transfer an NFT to different owner.
     *
     * @param _from The sender address.
     * @param _to The receiver address.
     * @param _id The card id to burn NFT from.
     * @param _editions The editions of NFT to transfer.
     */
    function transfer(address _from, address _to, uint256 _id, uint256[] memory _editions) public ownEditions(_id, _editions) {
        safeTransferFrom(_from, _to, _id, _editions.length, "");
        
        for (uint256 index = 0; index < nfts.length; index++) {
            if(nftOwners[_id][index] == _from) {
                nftOwners[_id][index] = _to;
                break;
            }
        }

        // move editions
        for (uint256 index = 1; index <= _editions.length; index++) {
            editions[_id][_editions[index]] = _to;
        }
    }

    /**
     * @dev ERC1155 and AccessControl include supportsInterface so we need to override both
     */
    function supportsInterface(bytes4 _interfaceId)
        public
        view
        virtual
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }
}
