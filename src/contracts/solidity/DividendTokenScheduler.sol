// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.6.6;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "./ChainlinkConfiguration.sol";
import "./IDividendToken.sol";

/**
 * @title DividendTokenScheduler
 * @author Giancarlo Sanchez
 * @notice Orchestrator for "stable coin" mock yield distribution.
 */
contract DividendTokenScheduler is ChainlinkClient {

    bytes32 public currentRequestId;
    uint256 public timer = 0;
    uint256 public limitAmount = 0;
    bytes32 public lastFullfilled;
    address public source;
    address public target;
    bool public paused;

    ChainlinkConfiguration private configuration =  new ChainlinkConfiguration();

    /**
     * Constructor, utilizes ChainlinkConfiguration.sol for data
     */
    constructor() public {
        setPublicChainlinkToken();
    }

    /**
     * Set timer in seconds for dividend distribution
     **/
    function configureSchedule(
        uint256 intervalSeconds,
        address sourceAddress,
        address targetAddress,
        uint256 maxAmount
    ) public {
        timer = intervalSeconds;
        source = sourceAddress;
        target = targetAddress;
        limitAmount = maxAmount;
    }

    /**
     * Create a Chainlink request to start an alarm and after
     * the time in seconds is up, return throught the fulfillAlarm
     * function
     */
    function startTimer() public returns (bytes32 requestId) {
        require(timer > 0, "Timer must be set and different than zero");
        require(limitAmount > 0, "Amount must be set and different than zero");
        paused = false;
        Chainlink.Request memory request = buildChainlinkRequest(configuration.getJobIdScheduler(), address(this), this.fulfillAlarm.selector);
        request.addUint("until", block.timestamp + timer);
        currentRequestId = sendChainlinkRequestTo(configuration.getOracle(), request, configuration.getFee());
        return currentRequestId;
    }

    /**
     * Pause timer
     **/
    function stopTimer() public {
        paused = true;
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfillAlarm(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        lastFullfilled = currentRequestId;
        // Distribute yield
        generateYield();
        // Loop again next cycle
        if (!paused)
            startTimer();
    }

    /**
     * Call target contract for yield distribution
     **/
    function generateYield() public {
        IDividendToken(source).generateYield(target, limitAmount);
    }
}
