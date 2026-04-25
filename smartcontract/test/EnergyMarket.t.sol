// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/EnergyMarket.sol";
import "../src/EnergyReceipt.sol";

contract EnergyMarketTest is Test {
    EnergyReceipt internal receipt;
    EnergyMarket  internal market;

    address internal deployer = address(this);
    address internal seller   = makeAddr("seller");
    address internal buyer    = makeAddr("buyer");

    // 1 kWh = 1e18 units, harga 0.01 MON per kWh
    uint256 internal constant PRICE_PER_KWH = 0.01 ether;
    uint256 internal constant KWH_5         = 5e18;  // 5 kWh
    uint256 internal constant KWH_3         = 3e18;  // 3 kWh
    uint256 internal constant COST_5KWH     = (KWH_5 * PRICE_PER_KWH) / 1e18; // 0.05 MON

    function setUp() public {
        receipt = new EnergyReceipt();
        market  = new EnergyMarket(address(receipt));
        receipt.setEnergyMarket(address(market));

        // Kasih MON ke buyer
        vm.deal(buyer, 10 ether);
    }

    // ─── registerProducer ────────────────────────────────────────────

    function test_registerProducer() public {
        vm.prank(seller);
        market.registerProducer(PRICE_PER_KWH, KWH_5);

        (uint256 price, uint256 avail, bool active) = market.listings(seller);
        assertEq(price,  PRICE_PER_KWH);
        assertEq(avail,  KWH_5);
        assertTrue(active);
    }

    function test_registerProducer_revertsOnZeroPrice() public {
        vm.prank(seller);
        vm.expectRevert("EnergyMarket: price must be > 0");
        market.registerProducer(0, KWH_5);
    }

    function test_registerProducer_revertsOnZeroKwh() public {
        vm.prank(seller);
        vm.expectRevert("EnergyMarket: kWh must be > 0");
        market.registerProducer(PRICE_PER_KWH, 0);
    }

    // ─── updateListing ───────────────────────────────────────────────

    function test_updateListing() public {
        _registerSeller();

        vm.prank(seller);
        market.updateListing(0.02 ether, KWH_3);

        (uint256 price, uint256 avail, bool active) = market.listings(seller);
        assertEq(price, 0.02 ether);
        assertEq(avail, KWH_3);
        assertTrue(active);
    }

    function test_updateListing_zeroKwhDeactivates() public {
        _registerSeller();

        vm.prank(seller);
        market.updateListing(PRICE_PER_KWH, 0);

        (, , bool active) = market.listings(seller);
        assertFalse(active);
    }

    function test_updateListing_revertsIfNotSeller() public {
        vm.prank(buyer);
        vm.expectRevert("EnergyMarket: not a registered producer");
        market.updateListing(PRICE_PER_KWH, KWH_5);
    }

    // ─── buyEnergy ───────────────────────────────────────────────────

    function test_buyEnergy_createsTradeAndLocksEscrow() public {
        _registerSeller();

        vm.prank(buyer);
        market.buyEnergy{value: COST_5KWH}(seller, KWH_5);

        EnergyMarket.Trade memory t = market.getTrade(0);
        assertEq(t.seller, seller);
        assertEq(t.buyer,  buyer);
        assertEq(t.kwh,    KWH_5);
        assertEq(t.amount, COST_5KWH);
        assertEq(uint8(t.status), uint8(EnergyMarket.TradeStatus.Pending));

        // MON ada di contract
        assertEq(address(market).balance, COST_5KWH);
    }

    function test_buyEnergy_reducesSellerStock() public {
        _registerSeller();

        vm.prank(buyer);
        market.buyEnergy{value: COST_5KWH}(seller, KWH_5);

        (, uint256 avail, bool active) = market.listings(seller);
        assertEq(avail, 0);
        assertFalse(active); // stok habis → nonaktif otomatis
    }

    function test_buyEnergy_revertsOnWrongAmount() public {
        _registerSeller();

        vm.prank(buyer);
        vm.expectRevert("EnergyMarket: incorrect MON amount");
        market.buyEnergy{value: 0.01 ether}(seller, KWH_5); // harusnya 0.05
    }

    function test_buyEnergy_revertsOnInactiveSeller() public {
        vm.prank(buyer);
        vm.expectRevert("EnergyMarket: seller not active");
        market.buyEnergy{value: COST_5KWH}(seller, KWH_5);
    }

    function test_buyEnergy_revertsOnInsufficientStock() public {
        _registerSeller(); // 5 kWh stock

        uint256 kwh10 = 10e18;
        uint256 cost10 = (kwh10 * PRICE_PER_KWH) / 1e18;
        vm.deal(buyer, cost10);

        vm.prank(buyer);
        vm.expectRevert("EnergyMarket: insufficient kWh stock");
        market.buyEnergy{value: cost10}(seller, kwh10);
    }

    function test_buyEnergy_revertsOnSelfBuy() public {
        _registerSeller();

        vm.deal(seller, 10 ether);
        vm.prank(seller);
        vm.expectRevert("EnergyMarket: cannot buy from yourself");
        market.buyEnergy{value: COST_5KWH}(seller, KWH_5);
    }

    // ─── confirmDelivery ─────────────────────────────────────────────

    function test_confirmDelivery_releasesMonAndMintsNFT() public {
        _registerSeller();
        _buyEnergy();

        uint256 sellerBefore = seller.balance;

        vm.prank(seller);
        market.confirmDelivery(0);

        // Seller terima MON
        assertEq(seller.balance, sellerBefore + COST_5KWH);

        // Contract balance nol
        assertEq(address(market).balance, 0);

        // NFT ke buyer
        assertEq(receipt.ownerOf(0), buyer);

        // Status completed
        EnergyMarket.Trade memory t = market.getTrade(0);
        assertEq(uint8(t.status), uint8(EnergyMarket.TradeStatus.Completed));
    }

    function test_confirmDelivery_byOwner() public {
        _registerSeller();
        _buyEnergy();

        // deployer = owner contract
        market.confirmDelivery(0);

        assertEq(uint8(market.getTrade(0).status), uint8(EnergyMarket.TradeStatus.Completed));
    }

    function test_confirmDelivery_revertsIfNotAuthorized() public {
        _registerSeller();
        _buyEnergy();

        address rando = makeAddr("rando");
        vm.prank(rando);
        vm.expectRevert("EnergyMarket: not authorized");
        market.confirmDelivery(0);
    }

    function test_confirmDelivery_revertsIfAlreadyCompleted() public {
        _registerSeller();
        _buyEnergy();

        vm.prank(seller);
        market.confirmDelivery(0);

        vm.prank(seller);
        vm.expectRevert("EnergyMarket: trade not pending");
        market.confirmDelivery(0);
    }

    // ─── cancelTrade ─────────────────────────────────────────────────

    function test_cancelTrade_refundsBuyer() public {
        _registerSeller();
        _buyEnergy();

        uint256 buyerBefore = buyer.balance;

        vm.prank(buyer);
        market.cancelTrade(0);

        assertEq(buyer.balance, buyerBefore + COST_5KWH);
        assertEq(address(market).balance, 0);

        EnergyMarket.Trade memory t = market.getTrade(0);
        assertEq(uint8(t.status), uint8(EnergyMarket.TradeStatus.Cancelled));
    }

    function test_cancelTrade_restoresSellerStock() public {
        _registerSeller();
        _buyEnergy();

        vm.prank(buyer);
        market.cancelTrade(0);

        (, uint256 avail, bool active) = market.listings(seller);
        assertEq(avail, KWH_5);
        assertTrue(active);
    }

    function test_cancelTrade_revertsIfCompleted() public {
        _registerSeller();
        _buyEnergy();

        vm.prank(seller);
        market.confirmDelivery(0);

        vm.prank(buyer);
        vm.expectRevert("EnergyMarket: trade not pending");
        market.cancelTrade(0);
    }

    // ─── getActiveListings ────────────────────────────────────────────

    function test_getActiveListings() public {
        _registerSeller();

        address seller2 = makeAddr("seller2");
        vm.prank(seller2);
        market.registerProducer(0.02 ether, KWH_3);

        EnergyMarket.ListingView[] memory list = market.getActiveListings();
        assertEq(list.length, 2);
    }

    function test_getActiveListings_excludesInactive() public {
        _registerSeller();

        vm.prank(seller);
        market.deactivateListing();

        EnergyMarket.ListingView[] memory list = market.getActiveListings();
        assertEq(list.length, 0);
    }

    // ─── quoteEnergy ─────────────────────────────────────────────────

    function test_quoteEnergy() public {
        _registerSeller();
        uint256 quote = market.quoteEnergy(seller, KWH_5);
        assertEq(quote, COST_5KWH);
    }

    // ─── NFT tokenURI ────────────────────────────────────────────────

    function test_nftTokenURI_returnsBase64JSON() public {
        _registerSeller();
        _buyEnergy();

        vm.prank(seller);
        market.confirmDelivery(0);

        string memory uri = receipt.tokenURI(0);
        // Pastikan ada prefix data URI
        assertTrue(bytes(uri).length > 0);
        assertEq(_startsWith(uri, "data:application/json;base64,"), true);
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    function _registerSeller() internal {
        vm.prank(seller);
        market.registerProducer(PRICE_PER_KWH, KWH_5);
    }

    function _buyEnergy() internal {
        vm.prank(buyer);
        market.buyEnergy{value: COST_5KWH}(seller, KWH_5);
    }

    function _startsWith(string memory str, string memory prefix) internal pure returns (bool) {
        bytes memory s = bytes(str);
        bytes memory p = bytes(prefix);
        if (s.length < p.length) return false;
        for (uint i = 0; i < p.length; i++) {
            if (s[i] != p[i]) return false;
        }
        return true;
    }
}
