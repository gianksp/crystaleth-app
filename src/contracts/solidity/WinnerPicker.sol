// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.6;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "./ChainlinkConfiguration.sol";
import "./IStakingToken.sol";

contract WinnerPicker is VRFConsumerBase {

    address public poolContractAddress;

    ChainlinkConfiguration private configuration = new ChainlinkConfiguration();

    constructor()
        VRFConsumerBase(
            configuration.getVRFCoordinator(),
            configuration.getToken()
        ) public
    {}

    /**
     * Requests randomness from a user-provided seed
     */
    function pickWinner(uint256 userProvidedSeed) public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= configuration.getFee(), "Not enough LINK - fill contract with faucet");
        return requestRandomness(configuration.getKeyHash(), configuration.getFee(), userProvidedSeed);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        IStakingToken(poolContractAddress).distributePrizePool(randomness);
    }

    /**
     * Set the target address to call distributePrizePool method
     **/
    function setPoolContractAddress(address contractAddress) public {
        poolContractAddress = contractAddress;
    }
}
