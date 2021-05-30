
/**
 * Provide as well the following config parameters in the Moralis server
 * covalentApiKey
 * covalentNetwork
 **/
const crypto = require("crypto");
const logger = Moralis.Cloud.getLogger();

Moralis.Cloud.beforeSave("User", (request) => {
  const newEmail = request.object.get("email");
  const newUsername = request.object.get("username");
  const oldEmail = request.user.get("email");
  if (newEmail != oldEmail) {
    // Welcome email
    Moralis.Cloud.sendEmail({
      to: newEmail,
      templateId: "d-850b1e16bced422fbea79c50f12ed9b0",
      dynamic_template_data: {
        username: newUsername
      }
    })
  }
});

Moralis.Cloud.define("getTokenBalances", async (request) => {
  const ethAddress = request.user.get("ethAddress");
  const config = await Moralis.Config.get({useMasterKey: true});
  const covalentNetwork = config.get("covalentNetwork")
  const covalentApiKey = config.get("covalentApiKey")
  logger.info(ethAddress);
  logger.info(covalentApiKey);
  return Moralis.Cloud.httpRequest({
    url: `https://api.covalenthq.com/v1/${covalentNetwork}/address/${ethAddress}/balances_v2/?key=${covalentApiKey}`
  });
});

Moralis.Cloud.define("getTokenTransfers", async (request) => {
  const ethAddress = request.user.get("ethAddress");
  const contractAddress = request.params.contractAddress;
  const config = await Moralis.Config.get({useMasterKey: true});
  const covalentNetwork = config.get("covalentNetwork")
  const covalentApiKey = config.get("covalentApiKey")
  logger.info(ethAddress);
  logger.info(covalentApiKey);
  logger.ingo(contractAddress);
  return Moralis.Cloud.httpRequest({
    url: `https://api.covalenthq.com/v1/${covalentNetwork}/address/${ethAddress}/transfers_v2/?key=${covalentApiKey}&contract-address=${contractAddress}`
  });
});
