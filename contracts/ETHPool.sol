// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./helpers/Errors.sol";

/**
 * @author Jason
 * @title ETHPool
 * @dev Ethereum Pool which has deposit/withdraw function with rewards.
 *      Owner is the Team address.
 */
contract ETHPool is Ownable, ERC20("staked ETH", "stETH") {
    uint256 public shareIndex;

    /**
     * @dev initialize the shareIndex as 1 with decimal 18
     */
    constructor() {
        shareIndex = 1e18;
    }

    /**
     * @dev deposit ether from user and mint share
     *      share value is calculated based on shareIndex
     *      which is growing overtime based on rewards amount from Team
     */
    function deposit() external payable {
        uint256 share = (msg.value * 1e18) / shareIndex;
        require(share != 0, Errors.POOL_INVALID_MINT_AMOUNT);
        _mint(msg.sender, share);
    }

    /**
     * @dev withdraw ether from pool and burn share
     *      share value is calculated based on shareIndex
     *      which is growing overtime based on rewards amount from Team
     * @param amount The amount being withdraw
     */
    function withdraw(uint256 amount) external {
        uint256 share = balanceOf(msg.sender);
        uint256 amountToWithdraw = amount;

        if (amount == type(uint256).max) {
            //withdraw 100% case
            amountToWithdraw = (share * shareIndex) / 1e18;
        } else {
            share = (amount * 1e18) / shareIndex;
        }

        require(share != 0, Errors.POOL_INVALID_BURN_AMOUNT);
        _burn(msg.sender, share);

        // send ETH to user
        (bool sent, ) = address(msg.sender).call{value: amountToWithdraw}("");
        require(sent, Errors.POOL_INVALID_WITHDRAW);
    }

    /**
     * @dev Deposits rewards to pool from Team
     *      Cumulate shareIndex based on rewards balance
     **/
    function depositRewards() external payable onlyOwner {
        // calculate rewardsEthAmount / totalEthAmount
        uint256 rewardsShareRatio = (msg.value * 1e18) /
            (address(this).balance - msg.value);

        // calculate 1 + rewardsShareRatio
        uint256 newerShareIndex = rewardsShareRatio + 1e18;

        // calculate oldIndex * (1 + rewardsShareRatio)
        shareIndex = (newerShareIndex * shareIndex) / 1e18;
    }
}
