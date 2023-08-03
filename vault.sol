// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vault {
    mapping (address => uint256) private balances;

    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);

    function deposit() external payable {
        require(msg.value > 0, "Can't deposit 0 amount");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
        
    }

    function Withdraw(uint256 amount) external {
        require(amount > 0, "Can't withdraw 0 amount");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);

    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}