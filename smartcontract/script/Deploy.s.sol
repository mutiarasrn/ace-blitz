// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/EnergyReceipt.sol";
import "../src/EnergyMarket.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        // 1. Deploy EnergyReceipt
        EnergyReceipt energyReceipt = new EnergyReceipt();
        console.log("EnergyReceipt deployed:", address(energyReceipt));

        // 2. Deploy EnergyMarket dengan address EnergyReceipt
        EnergyMarket energyMarket = new EnergyMarket(address(energyReceipt));
        console.log("EnergyMarket deployed: ", address(energyMarket));

        // 3. Authorize EnergyMarket agar bisa mint NFT di EnergyReceipt
        energyReceipt.setEnergyMarket(address(energyMarket));
        console.log("EnergyMarket authorized as minter in EnergyReceipt");

        console.log("Deployer:             ", deployer);

        vm.stopBroadcast();
    }
}
