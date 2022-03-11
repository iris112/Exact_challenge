import { task } from "hardhat/config";

export const getEthAmount = task(
  "getEthAmount",
  "Get total ether amount of ETHPool contract"
  // eslint-disable-next-line no-empty-pattern
).setAction(async ({}, { deployments, network }) => {
  try {
    const ethPoolAddress =
      network.name === "rinkeby"
        ? "0xDB06C21B8Ff8057a30B61409568B68a03FF8Ae13"
        : (await deployments.get("ETHPool")).address;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { waffle } = require("hardhat");
    const totalEthAmount = await waffle.provider.getBalance(ethPoolAddress);

    console.log(
      "\n Total Ether of ETHPool contract: \n",
      totalEthAmount.toString()
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
