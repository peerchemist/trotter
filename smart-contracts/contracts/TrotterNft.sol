// SPDX-License-Identifier: MIT
pragma solidity =0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TrotterNft is AccessControl, ERC1155("http://162.55.50.41:3000/api/nfts/{id}.json") {
    using SafeMath for uint256;

    function initialize() public {
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
        string description;
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
    // nftid ==> edition count
    mapping(uint256 => uint256) public totalEditions; 

    event CardAdded(uint256 id, uint256 maxSupply);

    /**
     * @notice Creates nft card and mints a new NFT for first time.
     *
     * @param _name Name of nft
     * @param _ipfsHash Ipfs Hash of nft media
     * @param _price Price of nft (in eth)
     * @param _author Author of nft
     * @param _description More details description nft
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
        string memory _description,
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
            description: _description,
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

        circulatingSupply[_id] = circulatingSupply[_id].add(_amount);
        // create editions
        for (uint256 index = 1; index <= _amount; index++) {
            editions[_id][totalEditions[_id].add(1)] = _to;
        }
    }

    /**
     * @notice Burn an NFT from NFT card.
     *
     * @param _id The card id to burn NFT from.
     * @param _amount The amount of editions of NFT to burn from this card.
     */
    function burn(uint256 _id, uint256 _amount) public {
        address sender = _msgSender();
        _burn(sender, _id, _amount);

        for (uint256 index = 0; index < nfts.length; index++) {
            if(nftOwners[_id][index] == sender) {
                nftOwners[_id][index] = nftOwners[_id][nftOwners[_id].length - 1];
                nftOwners[_id].pop();
                break;
            }
        }

        circulatingSupply[_id] = circulatingSupply[_id].sub(_amount);
    }

    /**
     * @notice Transfer an NFT to different owner.
     *
     * @param _from The sender address.
     * @param _to The receiver address.
     * @param _id The card id to burn NFT from.
     * @param _amount The editions of NFT to transfer.
     */
    function transfer(address _from, address _to, uint256 _id, uint256 _amount) public {
        safeTransferFrom(_from, _to, _id, _amount, "");
        
        for (uint256 index = 0; index < nfts.length; index++) {
            if(nftOwners[_id][index] == _from) {
                nftOwners[_id][index] = _to;
                break;
            }
        }

        // create editions
        for (uint256 index = 1; index <= _amount; index++) {
            editions[_id][totalEditions[_id].add(1)] = _to;
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
