import { parseEther } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";
import { ETHPool, ETHPool__factory } from "../typechain";

import chai from "chai";
import chaiAlmost from "chai-almost";

chai.use(chaiAlmost());

const { expect } = chai;
const MAX_UINT256_AMOUNT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

describe("ETHPool", () => {
  let ethPool: ETHPool;

  before("deploy ETHPool", async () => {
    const [deployer] = await ethers.getSigners();
    const factory = new ETHPool__factory(deployer);
    ethPool = await factory.deploy();
    await ethPool.deployed();
  });

  it("Case 1: User1 deposit 100ETH, User2 deposit 300ETH, Team deposit 200ETH as rewards, then User1 receive 150ETH and User2 receive 450ETH when withdraw", async () => {
    const [, ...restSigners] = await ethers.getSigners();
    const user1 = restSigners[0];
    const user2 = restSigners[1];

    // User1 deposit 100ETH, User2 deposit 300ETH
    await ethPool.connect(user1).deposit({ value: parseEther("100") });
    await ethPool.connect(user2).deposit({ value: parseEther("300") });

    // get before balance for User1 and User2
    const beforeBalanceOfUser1 = await waffle.provider.getBalance(
      user1.address
    );
    const beforeBalanceOfUser2 = await waffle.provider.getBalance(
      user2.address
    );

    // Team deposit 200ETH as rewards
    await ethPool.depositRewards({ value: parseEther("200") });

    // User1 withdraw full amount, User2 withdraw full amount;
    await ethPool.connect(user1).withdraw(MAX_UINT256_AMOUNT);
    await ethPool.connect(user2).withdraw(MAX_UINT256_AMOUNT);

    // get balance for User1 and User2 after withdraw
    const currentBalanceOfUser1 = await waffle.provider.getBalance(
      user1.address
    );
    const currentBalanceOfUser2 = await waffle.provider.getBalance(
      user2.address
    );

    // expect(
    //   currentBalanceOfUser1.sub(beforeBalanceOfUser1).toString()
    // ).to.be.almost(parseEther("150"));
    // expect(currentBalanceOfUser2.sub(beforeBalanceOfUser2)).to.be.almost(
    //   parseEther("450")
    // );
    expect(currentBalanceOfUser1.sub(beforeBalanceOfUser1).toString()).to.be.gt(
      parseEther("149")
    );
    expect(currentBalanceOfUser2.sub(beforeBalanceOfUser2)).to.be.gt(
      parseEther("449")
    );
  });

  it("Case 1: User1 deposit 100ETH, Team deposit 200ETH as rewards, User2 deposit 300ETH then User1 receive 300ETH and User2 receive 300ETH when withdraw", async () => {
    const [, ...restSigners] = await ethers.getSigners();
    const user1 = restSigners[0];
    const user2 = restSigners[1];

    // User1 deposit 100ETH
    await ethPool.connect(user1).deposit({ value: parseEther("100") });
    // get before balance for User1
    const beforeBalanceOfUser1 = await waffle.provider.getBalance(
      user1.address
    );

    // Team deposit 200ETH as rewards
    await ethPool.depositRewards({ value: parseEther("200") });

    // User2 deposit 300ETH
    await ethPool.connect(user2).deposit({ value: parseEther("300") });
    // get before balance for User2
    const beforeBalanceOfUser2 = await waffle.provider.getBalance(
      user2.address
    );

    // User1 withdraw full amount, User2 withdraw full amount;
    await ethPool.connect(user1).withdraw(MAX_UINT256_AMOUNT);
    await ethPool.connect(user2).withdraw(MAX_UINT256_AMOUNT);

    // get balance for User1 and User2 after withdraw
    const currentBalanceOfUser1 = await waffle.provider.getBalance(
      user1.address
    );
    const currentBalanceOfUser2 = await waffle.provider.getBalance(
      user2.address
    );

    // expect(
    //   currentBalanceOfUser1.sub(beforeBalanceOfUser1).toString()
    // ).to.be.almost(parseEther("300"));
    // expect(currentBalanceOfUser2.sub(beforeBalanceOfUser2)).to.be.almost(
    //   parseEther("300")
    // );
    expect(currentBalanceOfUser1.sub(beforeBalanceOfUser1).toString()).to.be.gt(
      parseEther("299")
    );
    expect(currentBalanceOfUser2.sub(beforeBalanceOfUser2)).to.be.gt(
      parseEther("299")
    );
  });
});
