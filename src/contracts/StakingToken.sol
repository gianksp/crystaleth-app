// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

//------------------------------------------------------------------------------
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/math
//------------------------------------------------------------------------------
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
//------------------------------------------------------------------------------
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC20
//------------------------------------------------------------------------------
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
//------------------------------------------------------------------------------
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/ownership
//------------------------------------------------------------------------------
import "openzeppelin-solidity/contracts/access/Ownable.sol";

/**
 * @title CrystalEth Token (CRY)
 * @author Giancarlo Sanchez
 * @notice Implements a basic ERC20 staking token with yield distribution and prize pool.
 */
contract StakingToken is ERC20, Ownable {
    using SafeMath for uint256;


    address[] internal stakeholders;
    address[] internal prizePoolParticipants;

    address internal lastWinner;
    uint256 internal lastPrizePool;

    ERC20 internal payableToken;

    mapping(address => uint256) internal stakes;


    mapping(address => uint256) internal rewards;

    uint256 internal prizePoolAllocation;


    constructor(uint256 initialSupply, address _payableToken) ERC20("CrystalEth", "CRY") {
        _mint(msg.sender, initialSupply);
        setDividendToken(_payableToken);
        resetPrizePool();
    }
    /**
     * @notice The constructor for the Staking Token.
     * @param _owner The address to receive all tokens on construction.
     * @param _supply The amount of tokens to mint on construction.
     */
    function mint(address _owner, uint256 _supply)
        public
    {
        _mint(_owner, _supply);
    }

    // ---------- STAKES ----------

    /**
     * @notice A method for a stakeholder to create a stake.
     * @param _stake The size of the stake to be created.
     */
    function createStake(uint256 _stake)
        public
    {
        _burn(msg.sender, _stake);
        if(stakes[msg.sender] == 0) addStakeholder(msg.sender);
        stakes[msg.sender] = stakes[msg.sender].add(_stake);
    }

    /**
     * @notice A method for a stakeholder to remove a stake.
     * @param _stake The size of the stake to be removed.
     */
    function removeStake(uint256 _stake)
        public
    {
        stakes[msg.sender] = stakes[msg.sender].sub(_stake);
        if(stakes[msg.sender] == 0) removeStakeholder(msg.sender);
        _mint(msg.sender, _stake);
    }

    /**
     * @notice A method to retrieve the stake for a stakeholder.
     * @param _stakeholder The stakeholder to retrieve the stake for.
     * @return uint256 The amount of wei staked.
     */
    function stakeOf(address _stakeholder)
        public
        view
        returns(uint256)
    {
        return stakes[_stakeholder];
    }

    /**
     * @notice A method to the aggregated stakes from all stakeholders.
     * @return uint256 The aggregated stakes from all stakeholders.
     */
    function totalStakes()
        public
        view
        returns(uint256)
    {
        uint256 _totalStakes = 0;
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            _totalStakes = _totalStakes.add(stakes[stakeholders[s]]);
        }
        return _totalStakes;
    }

    // ---------- STAKEHOLDERS ----------

    /**
     * @notice A method to check if an address is a stakeholder.
     * @param _address The address to verify.
     * @return bool, uint256 Whether the address is a stakeholder,
     * and if so its position in the stakeholders array.
     */
    function isStakeholder(address _address)
        public
        view
        returns(bool, uint256)
    {
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            if (_address == stakeholders[s]) return (true, s);
        }
        return (false, 0);
    }

    function totalStakeholders() public view returns(uint256) {
        return stakeholders.length;
    }

    /**
     * @notice A method to add a stakeholder.
     * @param _stakeholder The stakeholder to add.
     */
    function addStakeholder(address _stakeholder)
        public
    {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if(!_isStakeholder) stakeholders.push(_stakeholder);
    }

    /**
     * @notice A method to remove a stakeholder.
     * @param _stakeholder The stakeholder to remove.
     */
    function removeStakeholder(address _stakeholder)
        public
    {
        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
        if(_isStakeholder){
            stakeholders[s] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }
    }

    // ---------- REWARDS ----------

    /**
     * @notice A method to allow a stakeholder to check his rewards.
     * @param _stakeholder The stakeholder to check rewards for.
     */
    function rewardOf(address _stakeholder)
        public
        view
        returns(uint256)
    {
        return rewards[_stakeholder];
    }

    /**
     * @notice A method to the aggregated rewards from all stakeholders.
     * @return uint256 The aggregated rewards from all stakeholders.
     */
    function totalRewards()
        public
        view
        returns(uint256)
    {
        uint256 _totalRewards = 0;
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            _totalRewards = _totalRewards.add(rewards[stakeholders[s]]);
        }
        return _totalRewards;
    }

    /**
     * @notice A simple method that calculates the rewards for each stakeholder.
     * @param _stakeholder The stakeholder to calculate rewards for.
     */
    function calculateReward(address _stakeholder)
        public
        view
        returns(uint256)
    {
        return stakes[_stakeholder] / 100;
    }

    /**
     * @notice A method to distribute rewards to all stakeholders.
     */
    function distributeRewards()
        public
        onlyOwner
    {
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            address stakeholder = stakeholders[s];
            uint256 reward = calculateReward(stakeholder);
            rewards[stakeholder] = rewards[stakeholder].add(reward);
        }
    }

    /**
     * @notice A method to allow a stakeholder to withdraw his rewards.
     */
    function withdrawReward()
        public
    {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        _mint(msg.sender, reward);
    }

    // ------------------ Payable Stablecoin/rewards token -----------------------------------------------
    function balanceOfDividendToken() public view returns(uint256) {
        return payableToken.balanceOf(address(this));
    }

    function contractOfDividendToken() public view returns(address) {
        return address(payableToken);
    }

    function transferOfDividendToken(address _toAddress, uint256 _amount) public payable returns(bool) {
        return payableToken.transfer(_toAddress, _amount);
    }

    function setDividendToken(address _tokenAddress) public onlyOwner {
        payableToken = ERC20(_tokenAddress);
    }

    // ------------------- Payable Stablecoin Interest ---------------------

    function totalInterests() public view returns(uint256) {
        return balanceOfDividendToken() - totalPrizePool();
    }

    function totalPrizePool() public view returns(uint256) {
        return prizePoolAllocation;
    }

    function topUpPrizePool() private {
        prizePoolAllocation += balanceOfDividendToken() / 4;
    }

    function resetPrizePool() private {
        prizePoolAllocation = 0;
        delete prizePoolParticipants;
    }

    /**
     * @notice A method to allow a stakeholder to check his current interest.
     * @param _stakeholder The stakeholder to check interests for.
     */
    function interestOf(address _stakeholder)
        public
        view
        returns(uint256)
    {
        return stakeOf(_stakeholder) * totalInterests() / totalStakes();
    }

    /**
     * @notice A method to distribute rewards to all stakeholders.
     */
    function distributeInterests()
        public
        payable
        onlyOwner
    {
        topUpPrizePool();
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            address stakeholder = stakeholders[s];
            uint256 interest = interestOf(stakeholder);
            payableToken.transfer(stakeholder, interest);
        }
    }

    // -------------------------- Prize pool

    function distributePrizePool()
        public
        payable
        onlyOwner
    {
        require(prizePoolParticipants.length > 0, "Not enough participants");
        address winner = prizePoolParticipants[0];
        lastWinner = winner;
        payableToken.transfer(winner, totalPrizePool());
        resetPrizePool();
    }

    struct PrizePool {
       address winner;
       uint256 pool;
    }

    function lastPrizePoolData()
        public
        view
        returns(PrizePool memory)
    {
        return PrizePool(lastWinner, lastPrizePool);
    }


}
