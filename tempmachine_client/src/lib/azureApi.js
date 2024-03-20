import { DefaultAzureCredential } from "@azure/identity";
import { config } from "dotenv";
config();

export const azureCredentials = new DefaultAzureCredential();

// Azure platform authentication
export const clientId = import.meta.env.AZURE_CLIENT_ID;
export const tenantId = import.meta.env.AZURE_TENANT_ID;
export const secret = import.meta.env.AZURE_CLIENT_SECRET;
export const subscriptionId = import.meta.env.AZURE_SUBSCRIPTION_ID;

console.log(azureCredentials);
console.log("clientId : " + clientId);
console.log("tenantId : " + tenantId);
console.log("secret : " + secret);
console.log("subscriptionId : " + subscriptionId);
