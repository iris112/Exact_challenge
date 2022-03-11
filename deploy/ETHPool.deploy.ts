import { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name === "rinkeby" || hre.network.name === "localhost") {
    console.log(
      `Deploying ETHPool to ${hre.network.name}. Hit ctrl + c to abort`
    );
    // await sleep(10000);
  }

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("ETHPool", {
    from: deployer,
    args: [],
    log: hre.network.name !== "hardhat" ? true : false,
  });
};

export default func;

func.skip = async (hre: HardhatRuntimeEnvironment) => {
  const shouldSkip =
    hre.network.name === "mainnet" || hre.network.name === "ropsten";
  return shouldSkip ? true : false;
};

func.dependencies = [];
func.tags = ["ETHPool"];
