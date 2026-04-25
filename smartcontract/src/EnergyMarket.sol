// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EnergyReceipt.sol";

contract EnergyMarket is ReentrancyGuard, Ownable {
    // ─── Types ───────────────────────────────────────────────────────

    enum TradeStatus { Pending, Completed, Cancelled }

    struct Listing {
        uint256 pricePerKwh; // MON per kWh (in wei, where 1 kWh = 1e18 units)
        uint256 availableKwh; // in kWh units (1e18 = 1 kWh)
        bool active;
    }

    struct Trade {
        address seller;
        address buyer;
        uint256 kwh;       // energy amount in kWh units (1e18 = 1 kWh)
        uint256 amount;    // MON locked in escrow (in wei)
        TradeStatus status;
        uint256 timestamp;
    }

    // ─── State ───────────────────────────────────────────────────────

    EnergyReceipt public immutable receipt;

    mapping(address => Listing) public listings;
    mapping(uint256 => Trade) public trades;
    uint256 public tradeCounter;

    address[] private _sellers;
    mapping(address => bool) private _isSeller;

    // ─── Events ──────────────────────────────────────────────────────

    event ProducerRegistered(address indexed seller, uint256 pricePerKwh, uint256 availableKwh);
    event ListingUpdated(address indexed seller, uint256 pricePerKwh, uint256 availableKwh);
    event ListingDeactivated(address indexed seller);
    event TradeCreated(uint256 indexed tradeId, address indexed seller, address indexed buyer, uint256 kwh, uint256 amount);
    event TradeCompleted(uint256 indexed tradeId, address indexed seller, address indexed buyer, uint256 nftTokenId);
    event TradeCancelled(uint256 indexed tradeId, address indexed buyer, uint256 refund);

    // ─── Constructor ─────────────────────────────────────────────────

    constructor(address _receipt) Ownable(msg.sender) {
        require(_receipt != address(0), "EnergyMarket: zero address");
        receipt = EnergyReceipt(_receipt);
    }

    // ─── Seller functions ─────────────────────────────────────────────

    /// @notice Seller mendaftar sebagai producer dan set listing
    function registerProducer(uint256 pricePerKwh, uint256 availableKwh) external {
        require(pricePerKwh > 0, "EnergyMarket: price must be > 0");
        require(availableKwh > 0, "EnergyMarket: kWh must be > 0");

        listings[msg.sender] = Listing({
            pricePerKwh: pricePerKwh,
            availableKwh: availableKwh,
            active: true
        });

        if (!_isSeller[msg.sender]) {
            _isSeller[msg.sender] = true;
            _sellers.push(msg.sender);
        }

        emit ProducerRegistered(msg.sender, pricePerKwh, availableKwh);
    }

    /// @notice Update harga atau stok kWh
    function updateListing(uint256 pricePerKwh, uint256 availableKwh) external {
        require(_isSeller[msg.sender], "EnergyMarket: not a registered producer");
        require(pricePerKwh > 0, "EnergyMarket: price must be > 0");

        Listing storage l = listings[msg.sender];
        l.pricePerKwh = pricePerKwh;
        l.availableKwh = availableKwh;
        l.active = availableKwh > 0;

        emit ListingUpdated(msg.sender, pricePerKwh, availableKwh);
    }

    /// @notice Seller menonaktifkan listingnya
    function deactivateListing() external {
        require(_isSeller[msg.sender], "EnergyMarket: not a registered producer");
        listings[msg.sender].active = false;
        emit ListingDeactivated(msg.sender);
    }

    // ─── Buyer functions ──────────────────────────────────────────────

    /// @notice Buyer membeli energi — MON masuk escrow ke contract ini
    /// @param seller Address seller yang dipilih
    /// @param kwh Jumlah kWh yang ingin dibeli (dalam unit 1e18 = 1 kWh)
    function buyEnergy(address seller, uint256 kwh) external payable nonReentrant {
        require(kwh > 0, "EnergyMarket: kwh must be > 0");
        require(seller != msg.sender, "EnergyMarket: cannot buy from yourself");

        Listing storage l = listings[seller];
        require(l.active, "EnergyMarket: seller not active");
        require(l.availableKwh >= kwh, "EnergyMarket: insufficient kWh stock");

        uint256 expectedAmount = (kwh * l.pricePerKwh) / 1e18;
        require(msg.value == expectedAmount, "EnergyMarket: incorrect MON amount");

        l.availableKwh -= kwh;
        if (l.availableKwh == 0) l.active = false;

        uint256 tradeId = tradeCounter++;
        trades[tradeId] = Trade({
            seller: seller,
            buyer: msg.sender,
            kwh: kwh,
            amount: msg.value,
            status: TradeStatus.Pending,
            timestamp: block.timestamp
        });

        emit TradeCreated(tradeId, seller, msg.sender, kwh, msg.value);
    }

    // ─── Settlement functions ─────────────────────────────────────────

    /// @notice Seller (atau backend wallet) konfirmasi pengiriman — MON dilepas ke seller, NFT di-mint ke buyer
    function confirmDelivery(uint256 tradeId) external nonReentrant {
        Trade storage t = trades[tradeId];
        require(t.status == TradeStatus.Pending, "EnergyMarket: trade not pending");
        require(msg.sender == t.seller || msg.sender == owner(), "EnergyMarket: not authorized");

        t.status = TradeStatus.Completed;

        uint256 nftId = receipt.mintReceipt(
            t.buyer,
            t.seller,
            t.kwh,
            t.amount,
            tradeId,
            t.timestamp
        );

        (bool ok, ) = t.seller.call{value: t.amount}("");
        require(ok, "EnergyMarket: MON transfer failed");

        emit TradeCompleted(tradeId, t.seller, t.buyer, nftId);
    }

    /// @notice Cancel trade dan refund MON ke buyer
    function cancelTrade(uint256 tradeId) external nonReentrant {
        Trade storage t = trades[tradeId];
        require(t.status == TradeStatus.Pending, "EnergyMarket: trade not pending");
        require(
            msg.sender == t.buyer || msg.sender == t.seller || msg.sender == owner(),
            "EnergyMarket: not authorized"
        );

        t.status = TradeStatus.Cancelled;

        // Kembalikan stok ke seller
        listings[t.seller].availableKwh += t.kwh;
        if (!listings[t.seller].active && listings[t.seller].availableKwh > 0) {
            listings[t.seller].active = true;
        }

        uint256 refund = t.amount;
        (bool ok, ) = t.buyer.call{value: refund}("");
        require(ok, "EnergyMarket: refund failed");

        emit TradeCancelled(tradeId, t.buyer, refund);
    }

    // ─── View functions ───────────────────────────────────────────────

    struct ListingView {
        address seller;
        uint256 pricePerKwh;
        uint256 availableKwh;
    }

    /// @notice Ambil semua listing aktif
    function getActiveListings() external view returns (ListingView[] memory) {
        uint256 count;
        for (uint256 i = 0; i < _sellers.length; i++) {
            if (listings[_sellers[i]].active) count++;
        }

        ListingView[] memory result = new ListingView[](count);
        uint256 idx;
        for (uint256 i = 0; i < _sellers.length; i++) {
            address s = _sellers[i];
            if (listings[s].active) {
                result[idx++] = ListingView({
                    seller: s,
                    pricePerKwh: listings[s].pricePerKwh,
                    availableKwh: listings[s].availableKwh
                });
            }
        }
        return result;
    }

    /// @notice Ambil detail satu trade
    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        require(tradeId < tradeCounter, "EnergyMarket: trade does not exist");
        return trades[tradeId];
    }

    /// @notice Total semua trade yang pernah dibuat
    function totalTrades() external view returns (uint256) {
        return tradeCounter;
    }

    /// @notice Helper: hitung berapa MON yang harus dibayar untuk N kWh dari seller ini
    function quoteEnergy(address seller, uint256 kwh) external view returns (uint256 amount) {
        require(listings[seller].active, "EnergyMarket: seller not active");
        amount = (kwh * listings[seller].pricePerKwh) / 1e18;
    }
}
