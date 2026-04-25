// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyReceipt is ERC721, Ownable {
    struct ReceiptData {
        address seller;
        address buyer;
        uint256 kwh;
        uint256 amount; // in wei
        uint256 tradeId;
        uint256 timestamp;
    }

    address public energyMarket;
    uint256 private _tokenCounter;

    mapping(uint256 => ReceiptData) private _receipts;

    event ReceiptMinted(uint256 indexed tokenId, address indexed buyer, uint256 indexed tradeId);

    modifier onlyMarket() {
        require(msg.sender == energyMarket, "EnergyReceipt: caller is not EnergyMarket");
        _;
    }

    constructor() ERC721("WattChain Energy Receipt", "WATT") Ownable(msg.sender) {}

    function setEnergyMarket(address _market) external onlyOwner {
        require(_market != address(0), "EnergyReceipt: zero address");
        energyMarket = _market;
    }

    function mintReceipt(
        address buyer,
        address seller,
        uint256 kwh,
        uint256 amount,
        uint256 tradeId,
        uint256 timestamp
    ) external onlyMarket returns (uint256 tokenId) {
        tokenId = _tokenCounter++;
        _receipts[tokenId] = ReceiptData({
            seller: seller,
            buyer: buyer,
            kwh: kwh,
            amount: amount,
            tradeId: tradeId,
            timestamp: timestamp
        });
        _safeMint(buyer, tokenId);
        emit ReceiptMinted(tokenId, buyer, tradeId);
    }

    function getReceipt(uint256 tokenId) external view returns (ReceiptData memory) {
        require(ownerOf(tokenId) != address(0), "EnergyReceipt: token does not exist");
        return _receipts[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "EnergyReceipt: token does not exist");
        ReceiptData memory r = _receipts[tokenId];
        string memory svg = _buildSVG(r);
        string memory json = string(abi.encodePacked(
            '{"name":"WattChain Receipt #', _toString(tokenId), '",',
            '"description":"P2P Energy Trade Receipt on Monad",',
            '"image":"data:image/svg+xml;base64,', _base64(bytes(svg)), '",',
            '"attributes":[',
                '{"trait_type":"kWh","value":', _toString(r.kwh / 1e18), '},',
                '{"trait_type":"Trade ID","value":', _toString(r.tradeId), '},',
                '{"trait_type":"Timestamp","value":', _toString(r.timestamp), '}',
            ']}'
        ));
        return string(abi.encodePacked("data:application/json;base64,", _base64(bytes(json))));
    }

    // ─── SVG builder ───────────────────────────────────────────────

    function _buildSVG(ReceiptData memory r) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280" style="background:#0f172a;font-family:monospace">',
            '<rect x="12" y="12" width="376" height="256" rx="16" fill="none" stroke="#7c3aed" stroke-width="2"/>',
            '<text x="200" y="52" text-anchor="middle" fill="#a78bfa" font-size="20" font-weight="bold">WattChain Receipt</text>',
            '<text x="200" y="74" text-anchor="middle" fill="#6d28d9" font-size="11">P2P Energy Trade on Monad</text>',
            '<line x1="30" y1="86" x2="370" y2="86" stroke="#1e1b4b" stroke-width="1"/>',
            _svgRow(108, "Trade ID", _toString(r.tradeId)),
            _svgRow(136, "Energy",   string(abi.encodePacked(_toString(r.kwh / 1e18), " kWh"))),
            _svgRow(164, "Amount",   string(abi.encodePacked(_toString(r.amount / 1e15), " mMON"))),
            _svgAddrRow(192, "Seller", r.seller),
            _svgAddrRow(220, "Buyer",  r.buyer),
            _svgRow(248, "Time",     _toString(r.timestamp)),
            '</svg>'
        ));
    }

    function _svgRow(uint256 y, string memory label, string memory value) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '<text x="36" y="', _toString(y), '" fill="#94a3b8" font-size="11">', label, '</text>',
            '<text x="364" y="', _toString(y), '" text-anchor="end" fill="#e2e8f0" font-size="11">', value, '</text>'
        ));
    }

    function _svgAddrRow(uint256 y, string memory label, address addr) internal pure returns (string memory) {
        return _svgRow(y, label, _shortAddr(addr));
    }

    // ─── Helpers ────────────────────────────────────────────────────

    function _shortAddr(address addr) internal pure returns (string memory) {
        bytes memory full = bytes(_toHexString(addr));
        bytes memory short = new bytes(13);
        for (uint i = 0; i < 6; i++) short[i] = full[i + 2];
        short[6] = 0x2e; short[7] = 0x2e; short[8] = 0x2e;
        for (uint i = 0; i < 4; i++) short[9 + i] = full[full.length - 4 + i];
        return string(short);
    }

    function _toHexString(address addr) internal pure returns (string memory) {
        bytes memory buf = new bytes(42);
        buf[0] = '0'; buf[1] = 'x';
        bytes16 hex_chars = "0123456789abcdef";
        uint160 v = uint160(addr);
        for (uint i = 41; i >= 2; i--) {
            buf[i] = hex_chars[v & 0xf];
            v >>= 4;
        }
        return string(buf);
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buf = new bytes(digits);
        while (value != 0) {
            digits--;
            buf[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buf);
    }

    function _base64(bytes memory data) internal pure returns (string memory) {
        bytes memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        bytes memory result = new bytes(encodedLen);
        uint256 i;
        uint256 j;
        for (; i + 3 <= data.length; i += 3) {
            uint256 a = uint8(data[i]);
            uint256 b = uint8(data[i + 1]);
            uint256 c = uint8(data[i + 2]);
            result[j++] = TABLE[(a >> 2) & 0x3f];
            result[j++] = TABLE[((a & 3) << 4) | ((b >> 4) & 0xf)];
            result[j++] = TABLE[((b & 0xf) << 2) | ((c >> 6) & 3)];
            result[j++] = TABLE[c & 0x3f];
        }
        if (data.length - i == 1) {
            uint256 a = uint8(data[i]);
            result[j++] = TABLE[(a >> 2) & 0x3f];
            result[j++] = TABLE[(a & 3) << 4];
            result[j++] = '=';
            result[j++] = '=';
        } else if (data.length - i == 2) {
            uint256 a = uint8(data[i]);
            uint256 b = uint8(data[i + 1]);
            result[j++] = TABLE[(a >> 2) & 0x3f];
            result[j++] = TABLE[((a & 3) << 4) | ((b >> 4) & 0xf)];
            result[j++] = TABLE[(b & 0xf) << 2];
            result[j++] = '=';
        }
        return string(result);
    }
}
