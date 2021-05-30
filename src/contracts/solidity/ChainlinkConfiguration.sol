// SPDX-License-Identifier: GPL-3.0

/**
 * Chainlink Oracle Constants
 * Network: Kovan https://docs.chain.link/docs/decentralized-oracles-ethereum-mainnet/
 * Alarm: https://docs.chain.link/docs/chainlink-alarm-clock/
 * VRF (Randomizer): https://docs.chain.link/docs/get-a-random-number/
 * Fee: 0.1 LINK
 */
pragma solidity ^0.6.0;

/**
 * @title ChainlinkConfiguration
 * @author Giancarlo Sanchez
 * @notice Provides Chainlink oracle configuration for Alarm and VRF.
 */
contract ChainlinkConfiguration {

    address private constant chainlinkToken = 0xa36085F69e2889c224210F603D836748e7dC0088;
    address private constant oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
    uint256 private constant fee = 0.1 * 10 ** 18;
    address private constant vrfCoordinator = 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9;
    bytes32 private constant jobIdScheduler = "982105d690504c5d9ce374d040c08654";
    bytes32 private constant keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;

    function getToken() public pure returns(address) {
        return chainlinkToken;
    }

    function getOracle() public pure returns(address) {
        return oracle;
    }

    function getFee() public pure returns(uint256) {
        return fee;
    }

    function getVRFCoordinator() public pure returns(address) {
        return vrfCoordinator;
    }

    function getJobIdScheduler() public pure returns(bytes32) {
        return jobIdScheduler;
    }

    function getKeyHash() public pure returns(bytes32) {
        return keyHash;
    }
}
