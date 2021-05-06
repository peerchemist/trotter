// SPDX-License-Identifier: MIT
pragma solidity =0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TrotterNftErc721 is AccessControl, ERC721("Finite", "FNT") {
    using SafeMath for uint256;
    using Strings for uint256;
    
    // Used as the URI for all token types by relying on ID substitution, e.g. https://token-cdn-domain/{id}.json
    string private _uri;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

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

    uint256 public currentTokenId = 90000000;
    uint256 public tokenPrefix = 9;
    nftMetadata[] public nfts;
    mapping(uint256 => nftMetadata) public getNft;
    mapping(uint256 => address) public nftOwner;

    // events
    event CardAdded(uint256 id, address newOwner);

    constructor(string memory uri_) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        setURI(uri_);
    }

    /**
     * @dev Base URI for computing {tokenURI}. Empty by default, can be overriden
     * in child contracts.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _uri;
    }

    function uri(uint256) public view virtual returns (string memory) {
        return _uri;
    }

    function setURI(string memory newuri) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Caller is not admin");
        _uri = newuri;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, tokenPrefix.toString(), '-', tokenId.toString()))
            : '';
    }

    /**
     * @notice Creates an nft.
     *
     * @param _name Name of nft
     * @param _ipfsHash Ipfs Hash of nft media
     * @param _price Price of nft (in eth)
     * @param _author Author of nft
     * @param _description More details description nft
     * @param _properties Properties details about nft
     * @param _statement Any statement details about nft
     * @param _owner Address to mint NFT to.
     */
    function createNft(
        string memory _name,
        string memory _ipfsHash,
        uint256 _price,
        string memory _author,
        string memory _description,
        string memory _properties,
        string memory _statement,
        address _owner
    ) public returns (uint256) {
        require(hasRole(MINTER_ROLE, _msgSender()), "Caller is not a minter");
        uint256 nftId = currentTokenId;
        currentTokenId = currentTokenId.add(1);

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

        _mint(_owner, nftId);
        // _setTokenURI(newItemId, "http://162.55.50.41:3000/api/nfts/1.json");

        emit CardAdded(nftId, _owner);
        return nftId;
    }


    /**
     * @notice Burn an NFT.
     *
     * @param _id The NFT id to burn.
     */
    function burn(uint256 _id) public {
        _burn(_id);
    }

    /**
     * @dev ERC721 and AccessControl include supportsInterface so we need to override both
     */
    function supportsInterface(bytes4 _interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }
}
