// SPDX-License-Identifier: GPL-3.0

/**
 * Chainlink Scheduler
 * Will manage and allow configuration over the intervals for yield and prize pool
 * Every "interval" the yield distribution will be invoked and after reaching a full
 * "cycle" the pool distribution will be invoked.
 *
 * 1. Deploy contract
 * 2. Call configureSchedule
 * 5. Call startTimer
 */
pragma solidity ^0.6.6;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "./ChainlinkConfiguration.sol";
import "./IStakingToken.sol";
import "./IWinnerPicker.sol";

/**
 * @title ChainlinkScheduler
 * @author Giancarlo Sanchez
 * @notice Orchestrator for yield distribution and prize pool.
 */
contract ChainlinkScheduler is ChainlinkClient {

    bytes32 public currentRequestId;
    uint256 public timer = 0;
    uint256 public cycles = 0;
    address public yieldContractAddress;
    address public poolContractAddress;
    uint256 public currentCycle;

    ChainlinkConfiguration private configuration =  new ChainlinkConfiguration();

    /**
     * Constructor, utilizes ChainlinkConfiguration.sol for data
     */
    constructor() public {
        setPublicChainlinkToken();
    }

    /**
     * Set timer in seconds for yield distribution and prize pool
     **/
    function configureSchedule(
        uint256 intervalSeconds,
        uint256 intervalsPerCycle,
        address yieldDistrbutionContractAddress,
        address prizePoolDistributionContractAddress
    ) public {
        timer = intervalSeconds;
        cycles = intervalsPerCycle;
        currentCycle = cycles;
        yieldContractAddress = yieldDistrbutionContractAddress;
        poolContractAddress = prizePoolDistributionContractAddress;
    }

    /**
     * Create a Chainlink request to start an alarm and after
     * the time in seconds is up, return throught the fulfillAlarm
     * function
     */
    function startTimer() public returns (bytes32 requestId) {
        require(timer > 0, "Timer must be set and different than zero");
        require(cycles > 0, "Cycles must be set and different than zero");
        Chainlink.Request memory request = buildChainlinkRequest(configuration.getJobIdScheduler(), address(this), this.fulfillAlarm.selector);
        request.addUint("until", block.timestamp + timer);
        currentRequestId = sendChainlinkRequestTo(configuration.getOracle(), request, configuration.getFee());
        return getCurrentRequestId();
    }

    /**
     * Get current Chainlink alarm oracle request identifier
     **/
    function getCurrentRequestId() public view returns (bytes32 requestId) {
        return currentRequestId;
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfillAlarm(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        // Distribute yield
        IStakingToken(yieldContractAddress).distributeInterests();
        currentCycle -= 1;
        if (currentCycle == 0) {
            currentCycle = cycles;
            // Distribute prize
            IWinnerPicker(poolContractAddress).pickWinner(_volume);

        }
        // Loop again next cycle
        startTimer();
    }
}
