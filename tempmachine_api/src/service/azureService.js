const { ComputeManagementClient } = require("@azure/arm-compute");
const { ResourceManagementClient } = require("@azure/arm-resources");
const { StorageManagementClient } = require("@azure/arm-storage");
const { NetworkManagementClient } = require("@azure/arm-network");
require("dotenv").config({ path: "./config/.env" });
const { DefaultAzureCredential } = require("@azure/identity");

const location = "francecentral";
const resourceGroupName = "fm-groupe-ressource-test";
const vnetName = "azure-sample-vnet";
const subnetName = "azure-sample-subnet";
const ipConfigName = "azure-sample-ip-config";
const networkInterfaceName = "azure-sample-nic";
const vmName = "VmName";
const adminUsername = "userlogin";
const adminPassword = "Pa$$w0rd91";
const domainNameLabel = "testdomainname";

const storageAccountName = "testac";
const publicIPName = "testpip";
const osDiskName = "testosdisk";

const accType = "Standard_LRS";

// Ubuntu config for VM
const publisher = "Canonical";
const offer = "UbuntuServer";
const sku = "14.04.3-LTS";

// Azure platform authentication
const clientId = process.env["AZURE_CLIENT_ID"];
const tenantId = process.env["AZURE_TENANT_ID"];
const secret = process.env["AZURE_CLIENT_SECRET"];
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];

if (!clientId || !tenantId || !secret || !subscriptionId) {
  console.log("Default credentials couldn't be found");
}
const azureCredentials = new DefaultAzureCredential();
const vmReference = {
  linux: {
    publisher: "Canonical",
    offer: "UbuntuServer",
    sku: "16.04.0-LTS",
    version: "latest",
  },
  windows: {
    publisher: "MicrosoftWindowsServer",
    offer: "WindowsServer",
    sku: "2016-Datacenter",
    version: "latest",
  },
};

const resourceManager = new ResourceManagementClient(
  azureCredentials,
  subscriptionId
);

const computeManager = new ComputeManagementClient(
  azureCredentials,
  subscriptionId
);

const storageManager = new StorageManagementClient(
  azureCredentials,
  subscriptionId
);

const networkManager = new NetworkManagementClient(
  azureCredentials,
  subscriptionId
);

console.log(subscriptionId);

console.log(azureCredentials);

let virtualMachine;

const createResourceGroup = async () => {
  const groupParameters = {
    location: location,
  };
  console.log("\n1.Création du groupe de ressource : " + resourceGroupName);

  return await resourceManager.resourceGroups.createOrUpdate(
    resourceGroupName,
    groupParameters
  );
};

const createPublicIP = async () => {
  const publicIPParameters = {
    location: location,
    publicIPAllocationMethod: "Dynamic",
    dnsSettings: {
      domainNameLabel: domainNameLabel,
    },
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
    location: location,
    addressSpace: {
      addressPrefixes: ["10.0.0.0/16"],
    },
  };
  console.log("\n3.Creating vnet: " + vnetName);
  return await networkManager.virtualNetworks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vnetName,
    vnetParameters
  );
};

const createSubnet = async () => {
  const vnetParameters = {
    location: location,
    addressSpace: {
      addressPrefixes: ["10.0.0.0/16"],
    },
  };
  console.log("\n4.Creating subnet: " + subnetName);
  return await networkManager.resourceGroupName, vnetName, vnetParameters;
};

const createNIC = async (subnetInfo) => {
  const nicParameters = {
    location: location,
    ipConfigurations: [
      {
        name: ipConfigName,
        subnet: subnetInfo,
      },
    ],
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
    location: location,
    osProfile: {
      computerName: vmName,
      adminUsername: adminUsername,
      adminPassword: adminPassword,
    },
    hardwareProfile: {
      vmSize: "Standard_DS1_v2",
    },
    storageProfile: {
      imageReference: {
        publisher: vmReference.linux.publisher,
        offer: vmReference.linux.offer,
        sku: vmReference.linux.sku,
        version: vmReference.linux.version,
      },
    },
    networkProfile: {
      networkInterfaces: [
        {
          id: nicId,
          primary: true,
        },
      ],
    },
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
      location: location,
      tags: {
        "who-rocks": "python",
        where: "on azure",
      },
    }
  );
};

const createDataDisk = async () => {
  console.log("\n9. Create (empty) managed Data Disk");
  return await computeManager.disks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    "mydatadisk1",
    {
      location: location,
      disk_size_gb: 1,
      creation_data: {
        create_option: DiskCreateOption.empty,
      },
    }
  );
};

const getVirtualMachine = async () => {
  console.log("\n10. Get Virtual Machine by Name");
  return await computeManager.virtualMachines.get(resourceGroupName, vmName);
};

const attachDataDisk = async (virtualMachine) => {
  console.log("\n11. Attach Data Disk");
  virtualMachine.storageProfile.dataDisk.append({
    lun: 12,
    name: "mydatadisk1",
    create_option: DiskCreateOption.attach,
    managed_disk: {
      id: dataDisk.id,
    },
  });
  async_disk_attach = compute_client.virtual_machines.create_or_update(
    GROUP_NAME,
    virtual_machine.name,
    virtual_machine
  );
};

const detachDataDisk = async () => {
  print("\n12. Detach Data Disk");
  dataDisks = virtual_machine.storage_profile.data_disks;
  for (disk in datadisks) {
    if (disk.name != "mydatadisk1") {
      //do something
    }
  }
  return await computeManager.virtualMachines.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vmName,
    virtualMachine
  );
  //virtualMachine = async_vm_update.result()
};

const deallocateVirtualMachine = async () => {
  console.log("\n13. Deallocating the VM (to prepare for a disk resize)");
  return await computeManager.virtualMachines.beginDeallocateAndWait(
    resourceGroupName,
    vmName
  );
};

const getSubnetInfo = async () => {
  console.log("\nCreate Subnet");
  const subnetCreation =
    await networkManager.subnets.beginCreateOrUpdateAndWait(
      resourceGroupName,
      vnetName,
      subnetName,
      { addressPrefix: "10.0.0.0/24" }
    );

  console.log("\nGetting subnet info for: " + subnetName);
  return await networkManager.subnets.get(
    resourceGroupName,
    vnetName,
    subnetName
  );
};

// const updateDiskSize = async () => {
//   console.log('\n14. Update OS disk size')
//       osDiskName = virtualMachine.storageProfile.os_disk.name
//       osDisk = compute_client.disks.get(GROUP_NAME, osDiskName)
//       if (osDisk.disk_size_gb)
//           print(
//               "\tServer is not returning the OS disk size, possible bug in the server?")
//           print("\tAssuming that the OS disk size is 30 GB")
//           os_disk.disk_size_gb = 30

//       os_disk.disk_size_gb += 10

//       return await computeManager.disks.createOrUpdate(
//           GROUP_NAME,
//           osDisk.name,
//           osDisk
//       )

// }

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
    location: location,
    osProfile: {
      computerName: vmName,
      adminUsername: adminUsername,
      adminPassword: adminPassword,
    },
    hardwareProfile: {
      vmSize: "Standard_DS1_v2",
    },
    storageProfile: {
      imageReference: {
        publisher: vmReference.windows.publisher,
        offer: vmReference.windows.offer,
        sku: vmReference.windows.sku,
        version: vmReference.windows.version,
      },
    },
    networkProfile: {
      networkInterfaces: [
        {
          id: nicId,
          primary: true,
        },
      ],
    },
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

/**
 * Get all users.
 * @route GET /users
 * @returns {Promise<object[]>} A promise that resolves to an array of user objects.
 */
const test = async (req, res) => {
  // try {
  //   const users = await userService.getUsers();
  //   res.setHeader("Cache-Control", "public, max-age=3600");
  //   res.json(users);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: "Failed to retrieve users" });
  // }

  try {
    let result = await createResourceGroup();
    let vnetInfo = await createVnet();
    let subnetInfo = await getSubnetInfo();
    let publicIPInfo = await createPublicIP();
    let nicInfo = await createNIC(subnetInfo);
    // vmInfo = await createVirtualMachine(nicInfo.id);
    // tagVirtualMachine();

    // virtualMachine = getVirtualMachine();

    // startVirtualMachine();
    // restartVirtualMachine();
    // stopVirtualMachine();
    // deleteVirtualMachine();

    createWindowsVM(nicInfo.id);

    // deleteResourceGroup();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  test,
};
