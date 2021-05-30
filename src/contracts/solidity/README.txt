# Basic deployment
1. Deploy DividendToken.sol
2. Deploy StakingToken.sol, set payableToken as the DividendToken address
3. Deploy WinnerPicker.sol, fund with Link, call setPoolContractAddress with StakingToken address


# Enabling Schedulers
1. Deploy DividendTokenScheduler.sol, fund with Link and call configureSchedule and then startTimer (source = DividendToken, target = StakingToken)
2. Deploy ChainLinkScheduler.sol, fund with link and call configureSchedule set yieldDistributionContractAddress as StakingToken and the prizePoolDistributionContractAddress as the WinnerPicker
