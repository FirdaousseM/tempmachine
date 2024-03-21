const { DefaultAzureCredential } = require("@azure/identity");

// Azure platform authentication
const clientId = process.env["AZURE_CLIENT_ID"];
const tenantId = process.env["AZURE_TENANT_ID"];
const secret = process.env["AZURE_CLIENT_SECRET"];
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];

if (!clientId || !tenantId || !secret || !subscriptionId) {
  console.log("Default credentials couldn't be found");
}
const azureCredentials = new DefaultAzureCredential();

module.exports = {
  credentials: azureCredentials,
  subscriptionId: subscriptionId,
};
