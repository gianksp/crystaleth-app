// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;


import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

/**
 * @title CrystalEth Token (CRY)
 * @author Giancarlo Sanchez
 * @notice Implements a basic ERC20 staking token with yield distribution and prize pool.
 */
contract StakingToken is ERC20, Ownable {
    using SafeMath for uint256;

    ERC20 internal payableToken;

    // Yield
    address[] internal stakeholders;
    mapping(address => uint256) internal stakes;

    // Prize
    address internal lastWinner;
    uint256 internal lastPrizePool;
    uint256 public lastPrizePoolSeed;

    uint256 internal prizePoolAllocation;
    address[] internal poolParticipants;
    mapping(address => uint256) internal pool;

    constructor(uint256 initialSupply, address _payableToken) ERC20("CrystalEth", "CRY") {
        _mint(address(this), initialSupply * 10 ** 18);
        setDividendToken(_payableToken);
        resetPrizePool();
    }

    /**
     * Generate new tokens to given address
     * For hackathon purposes only to allow new users to test
     */
    function mint(address _owner) public {
        _burn(address(this), 1000 * 10 ** 18);
        _mint(_owner, 1000 * 10 ** 18);
    }

    // ---------- STAKES ----------

    /**
     * A method for a stakeholder to create a stake
     */
    function createStake(uint256 _stake) public {
        _burn(msg.sender, _stake);
        if(stakes[msg.sender] == 0) addStakeholder(msg.sender);
        stakes[msg.sender] = stakes[msg.sender].add(_stake);
    }

    /**
     * A method for a stakeholder to withdraw a stake
     */
    function removeStake(uint256 _stake) public {
        stakes[msg.sender] = stakes[msg.sender].sub(_stake);
        if(stakes[msg.sender] == 0) removeStakeholder(msg.sender);
        _mint(msg.sender, _stake);
    }

    /**
     * View current stake of stakeholder
     */
    function stakeOf(address _stakeholder)  public view returns(uint256) {
        return stakes[_stakeholder];
    }

    /**
     * View all aggregated stakes
     */
    function totalStakes() public view returns(uint256) {
        uint256 _totalStakes = 0;
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            _totalStakes = _totalStakes.add(stakes[stakeholders[s]]);
        }
        return _totalStakes;
    }

    // ---------- STAKEHOLDERS ----------

    /**
     * Check if address is stakeholder
     */
    function isStakeholder(address _address) public view returns(bool, uint256) {
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            if (_address == stakeholders[s]) return (true, s);
        }
        return (false, 0);
    }

    /**
     * Total participants staking
     **/
    function totalStakeholders() public view returns(uint256) {
        return stakeholders.length;
    }

    /**
     * Add as stakeholder
     */
    function addStakeholder(address _stakeholder) public {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if(!_isStakeholder) stakeholders.push(_stakeholder);
    }

    /**
     * Remove as stakeholder
     */
    function removeStakeholder(address _stakeholder) public {
        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
        if(_isStakeholder){
            stakeholders[s] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }
    }

    // ---------- DIVIDEND TOKEN ----------

    /**
     * Total balance of dividend token locked in contract
     **/
    function balanceOfDividendToken() public view returns(uint256) {
        return payableToken.balanceOf(address(this));
    }

    /**
     * Dividend token contract
     **/
    function contractOfDividendToken() public view returns(address) {
        return address(payableToken);
    }

    /**
     * Payout dividend amount to address
     **/
    function transferOfDividendToken(address _toAddress, uint256 _amount) public payable returns(bool) {
        return payableToken.transfer(_toAddress, _amount);
    }

    /**
     * Set dividend token contract
     **/
    function setDividendToken(address _tokenAddress) public onlyOwner {
        payableToken = ERC20(_tokenAddress);
    }

    // ---------- YIELD ----------

    /**
     * Total interest = total locked in - pool allocation
     **/
    function totalInterests() public view returns(uint256) {
        return balanceOfDividendToken() - totalPrizePool();
    }


    /**
     * Interest calculated for stakeholder
     */
    function interestOf(address _stakeholder) public view returns(uint256) {
        return stakeOf(_stakeholder) * totalInterests() / totalStakes();
    }

    /**
     * Distribute interests to all stakeholders depending on their stake
     */
    function distributeInterests() public payable {
        prizePoolAllocation = prizePoolAllocation + 150 * 10 ** 18;
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            address stakeholder = stakeholders[s];
            uint256 interest = interestOf(stakeholder);
            payableToken.transfer(stakeholder, interest);
        }
    }

    // ---------- PRIZE POOL ----------

    /**
     * Pool allocation for next draw
     **/
    function totalPrizePool() public view returns(uint256) {
        return prizePoolAllocation;
    }

    /**
     * Reset pool allocation (manual)
     **/
    function resetPoolManual() public onlyOwner {
        resetPrizePool();
    }

    /**
     * Reset pool allocation
     **/
    function resetPrizePool() private {
        prizePoolAllocation = 0;
        delete poolParticipants;
    }

    /**
     *  Get last randomizer seed used
     **/
    function prizePoolSeed(uint256 seed) public {
        lastPrizePoolSeed = seed;
    }

    /**
     * Distribute prize pool
     **/
    function distributePrizePool(uint256 randomness) public payable {
        require(poolParticipants.length > 0, "Not enough participants");
        uint256 index = randomness % poolParticipants.length;
        lastPrizePoolSeed = randomness;
        address winner = poolParticipants[index];
        lastWinner = winner;
        payableToken.transfer(winner, totalPrizePool());
        resetPrizePool();
    }

    /**
     * Check if address is participating in pool
     */
    function isPoolParticipant(address _address) public view returns(bool, uint256) {
        for (uint256 s = 0; s < poolParticipants.length; s += 1){
            if (_address == poolParticipants[s]) return (true, s);
        }
        return (false, 0);
    }

    /**
     * Get total tickets issued for prize pool
     **/
    function totalPoolParticipants() public view returns(uint256) {
        return poolParticipants.length;
    }

    /**
     * Add prize pool participant
     */
    function addPoolParticipant(address _participant, uint256 _tickets) public {
        for (uint256 s = 0; s < _tickets; s += 1){
            poolParticipants.push(_participant);
        }
    }

    struct PrizePool {
       address winner;
       uint256 pool;
    }

    /**
     * View last draw details
     **/
    function lastPrizePoolData() public view returns(PrizePool memory) {
        return PrizePool(lastWinner, lastPrizePool);
    }

    /**
     * Enter prize pool with number of entries
     */
    function prizePoolStake(uint256 entries) public {
        uint256 stake = entries * 10 ** 18;
        _burn(msg.sender, stake);
        _mint(address(this), stake);
        for (uint256 s = 0; s < entries; s += 1){
            poolParticipants.push(msg.sender);
        }
        pool[msg.sender] = pool[msg.sender].add(entries);
    }

    /**
     * Number of entries address has for next draw
     **/
    function prizePoolStakeOf(address _address) public view returns(uint256) {
        return pool[_address];
    }


}
