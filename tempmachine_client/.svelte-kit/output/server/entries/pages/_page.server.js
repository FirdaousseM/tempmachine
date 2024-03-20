import { DefaultAzureCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import { ComputeManagementClient } from "@azure/arm-compute";
import { StorageManagementClient } from "@azure/arm-storage";
import { NetworkManagementClient } from "@azure/arm-network";
const AZURE_TENANT_ID = "b7b023b8-7c32-4c02-92a6-c8cdaa1d189c";
const AZURE_CLIENT_ID = "8541a3fd-154a-4ee2-a7d8-77558118ac91";
const AZURE_CLIENT_SECRET = "P9s8Q~78RGICjLCzH01NmqcfkXWoHB~cGQjGwdbt";
const AZURE_SUBSCRIPTION_ID = "2a55704b-9aba-4073-a059-84277776726c";
const clientId = AZURE_CLIENT_ID;
const tenantId = AZURE_TENANT_ID;
const secret = AZURE_CLIENT_SECRET;
const subscriptionId = AZURE_SUBSCRIPTION_ID;
const azureCredentials = new DefaultAzureCredential();
const location = "francecentral";
const resourceGroupName = "fm-groupe-ressource-test";
const vnetName = "azure-sample-vnet";
const subnetName = "azure-sample-subnet";
const ipConfigName = "azure-sample-ip-config";
const networkInterfaceName = "azure-sample-nic";
const vmName = "VmName";
const adminUsername = "userlogin";
const adminPassword = "Pa$$w0rd91";
const vmReference = {
  linux: {
    publisher: "Canonical",
    offer: "UbuntuServer",
    sku: "16.04.0-LTS",
    version: "latest"
  },
  windows: {
    publisher: "MicrosoftWindowsServer",
    offer: "WindowsServer",
    sku: "2016-Datacenter",
    version: "latest"
  }
};
const resourceManager = new ResourceManagementClient(
  azureCredentials,
  subscriptionId
);
const computeManager = new ComputeManagementClient(
  azureCredentials,
  subscriptionId
);
new StorageManagementClient(
  azureCredentials,
  subscriptionId
);
const networkManager = new NetworkManagementClient(
  azureCredentials,
  subscriptionId
);
console.log(subscriptionId);
console.log(clientId);
console.log(tenantId);
console.log(secret);
console.log(azureCredentials);
let virtualMachine;
const load = () => {
  main();
};
const main = async () => {
  try {
    let result = await createResourceGroup();
    let vnetInfo = await createVnet();
    let subnetInfo = await getSubnetInfo();
    let publicIPInfo = await createPublicIP();
    let nicInfo = await createNIC(subnetInfo);
    vmInfo = await createVirtualMachine(nicInfo.id);
    tagVirtualMachine();
    virtualMachine = getVirtualMachine();
    startVirtualMachine();
    restartVirtualMachine();
    stopVirtualMachine();
    deleteVirtualMachine();
    createWindowsVM(nicInfo.id);
    deleteResourceGroup();
  } catch (error) {
    console.log(error);
  }
};
const createResourceGroup = async () => {
  const groupParameters = {
    location
  };
  console.log("\n1.Création du groupe de ressource : " + resourceGroupName);
  return await resourceManager.resourceGroups.createOrUpdate(
    resourceGroupName,
    groupParameters
  );
};
const createPublicIP = async () => {
  const publicIPParameters = {
    location,
    publicIPAllocationMethod: "Dynamic",
    dnsSettings: {
      domainNameLabel
    }
  };
  console.log("\n4.Creating public IP: " + publicIPName);
  return await networkManager.publicIPAddresses.beginCreateOrUpdateAndWait(
    resourceGroupName,
    publicIPName,
    publicIPParameters
  );
};
const createVnet = async () => {
  const vnetParameters = {
    location,
    addressSpace: {
      addressPrefixes: ["10.0.0.0/16"]
    }
  };
  console.log("\n3.Creating vnet: " + vnetName);
  return await networkManager.virtualNetworks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vnetName,
    vnetParameters
  );
};
const createNIC = async (subnetInfo) => {
  const nicParameters = {
    location,
    ipConfigurations: [
      {
        name: ipConfigName,
        subnet: subnetInfo
      }
    ]
  };
  console.log("\n5.Creating Network Interface: " + networkInterfaceName);
  return await networkManager.networkInterfaces.beginCreateOrUpdateAndWait(
    resourceGroupName,
    networkInterfaceName,
    nicParameters
  );
};
const createVirtualMachine = async (nicId) => {
  const vmParameters = {
    location,
    osProfile: {
      computerName: vmName,
      adminUsername,
      adminPassword
    },
    hardwareProfile: {
      vmSize: "Standard_DS1_v2"
    },
    storageProfile: {
      imageReference: {
        publisher: vmReference.linux.publisher,
        offer: vmReference.linux.offer,
        sku: vmReference.linux.sku,
        version: vmReference.linux.version
      }
    },
    networkProfile: {
      networkInterfaces: [
        {
          id: nicId,
          primary: true
        }
      ]
    }
  };
  console.log("6.Creating Virtual Machine: " + vmName);
  console.log(" VM create parameters: " + vmParameters);
  await computeManager.virtualMachines.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vmName,
    vmParameters
  );
};
const tagVirtualMachine = async () => {
  console.log("\n8. Tag Virtual Machine");
  return await computeManager.virtualMachines.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vmName,
    {
      location,
      tags: {
        "who-rocks": "python",
        where: "on azure"
      }
    }
  );
};
const getVirtualMachine = async () => {
  console.log("\n10. Get Virtual Machine by Name");
  return await computeManager.virtualMachines.get(resourceGroupName, vmName);
};
const getSubnetInfo = async () => {
  console.log("\nGetting subnet info for: " + subnetName);
  return await networkManager.subnets.get(
    resourceGroupName,
    vnetName,
    subnetName
  );
};
const startVirtualMachine = async () => {
  console.log("\n14. Start VM");
  return await computeManager.virtualMachines.beginStartAndWait(
    resourceGroupName,
    vmName
  );
};
const restartVirtualMachine = async () => {
  console.log("\n15. Restart VM");
  return await computeManager.virtualMachines.beginRestartAndWait(
    resourceGroupName,
    vmName
  );
};
const stopVirtualMachine = async () => {
  console.log("\n16. Stop VM");
  return await computeManager.virtualMachines.beginPowerOffAndWait(
    resourceGroupName,
    vmName
  );
};
const deleteVirtualMachine = async () => {
  console.log("\n17. Delete VM");
  return await computeManager.virtualMachines.beginDeleteAndWait(
    resourceGroupName,
    vmName
  );
};
const createWindowsVM = async (nicId) => {
  console.log("\n18. Creating Windows Virtual Machine");
  const vmParameters = {
    location,
    osProfile: {
      computerName: vmName,
      adminUsername,
      adminPassword
    },
    hardwareProfile: {
      vmSize: "Standard_DS1_v2"
    },
    storageProfile: {
      imageReference: {
        publisher: vmReference.windows.publisher,
        offer: vmReference.windows.offer,
        sku: vmReference.windows.sku,
        version: vmReference.windows.version
      }
    },
    networkProfile: {
      networkInterfaces: [
        {
          id: nicId,
          primary: true
        }
      ]
    }
  };
  console.log(" VM create parameters: " + vmParameters);
  return await computeManager.virtualMachines.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vmName,
    vmParameters
  );
};
const deleteResourceGroup = async () => {
  console.log("\n20. Delete Resource Group");
  return await resourceManager.resourceGroups.beginDeleteAndWait(
    resourceGroupName
  );
};
export {
  load
};
