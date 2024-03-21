const {
  credentials,
  subscriptionId,
} = require("../../config/azureCredentials");
const { ComputeManagementClient } = require("@azure/arm-compute");
const { ResourceManagementClient } = require("@azure/arm-resources");
const { StorageManagementClient } = require("@azure/arm-storage");
const { NetworkManagementClient } = require("@azure/arm-network");
require("dotenv").config({ path: "./config/.env" });

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
const publicIPName = "testpip";

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
  credentials,
  subscriptionId
);

const computeManager = new ComputeManagementClient(credentials, subscriptionId);

const networkManager = new NetworkManagementClient(credentials, subscriptionId);

const createResourceGroup = async () => {
  const groupParameters = {
    location: location,
  };
  console.log("Création du groupe de ressource : " + resourceGroupName);

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
  console.log("Creating public IP: " + publicIPName);
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
  console.log("Creating vnet: " + vnetName);
  return await networkManager.virtualNetworks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vnetName,
    vnetParameters
  );
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
  console.log("Creating Network Interface: " + networkInterfaceName);
  return await networkManager.networkInterfaces.beginCreateOrUpdateAndWait(
    resourceGroupName,
    networkInterfaceName,
    nicParameters
  );
};

const createVirtualMachine = async (os, nicId) => {
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
        publisher: os.publisher,
        offer: os.offer,
        sku: os.sku,
        version: os.version,
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
  console.log("Creating Virtual Machine: " + vmName);
  console.log(" VM create parameters: " + vmParameters);
  await computeManager.virtualMachines.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vmName,
    vmParameters
  );
};

const getVirtualMachine = async () => {
  console.log("Get Virtual Machine by Name");
  return await computeManager.virtualMachines.get(resourceGroupName, vmName);
};

const getSubnetInfo = async () => {
  console.log("Create Subnet");
  const subnetCreation =
    await networkManager.subnets.beginCreateOrUpdateAndWait(
      resourceGroupName,
      vnetName,
      subnetName,
      { addressPrefix: "10.0.0.0/24" }
    );

  console.log("Getting subnet info for: " + subnetName);
  return await networkManager.subnets.get(
    resourceGroupName,
    vnetName,
    subnetName
  );
};

const startVirtualMachine = async () => {
  console.log("Start VM");
  return await computeManager.virtualMachines.beginStartAndWait(
    resourceGroupName,
    vmName
  );
};

const stopVirtualMachine = async () => {
  console.log("Stop VM");
  return await computeManager.virtualMachines.beginPowerOffAndWait(
    resourceGroupName,
    vmName
  );
};

const deleteVirtualMachine = async () => {
  console.log("Delete VM");
  return await computeManager.virtualMachines.beginDeleteAndWait(
    resourceGroupName,
    vmName
  );
};

const deleteResourceGroup = async () => {
  console.log("Delete Resource Group");
  return await resourceManager.resourceGroups.beginDeleteAndWait(
    resourceGroupName
  );
};

/**
 * Test all azure methods
 * @route POST /start
 * @returns {Promise<object>} A promise that resolves to a string message of success.
 */
const startVM = async (req, res) => {
  try {
    const virtualMachine = req.params.virtualMachine;
    await startVirtualMachine(virtualMachine);
    res.status(200).json({ message: "Virtual machine successfully started" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start virtual machine" });
  }
};

/**
 * Test all azure methods
 * @route POST /stop
 * @returns {Promise<object>} A promise that resolves to a string message of success.
 */
const stopVM = async (req, res) => {
  try {
    const virtualMachine = req.params.virtualMachine;
    await stopVirtualMachine(virtualMachine);
    res.status(200).json({ message: "Virtual machine successfully stopped" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to stop virtual machine" });
  }
};

/**
 * Test all azure methods
 * @route POST /create
 * @returns {Promise<object>} A promise that resolves to the virtual machine info
 */
const createVM = async (req, res) => {
  try {
    const os = req.params.os;
    await createVirtualMachine(os);
    const virtualMachine = getVirtualMachine();
    res.json(virtualMachine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create virtual machine" });
  }
};

/**
 * Test all azure methods
 * @route POST /delete
 * @returns {Promise<object>} A promise that resolves a string message of success
 */
const deleteVM = async (req, res) => {
  try {
    await deleteVirtualMachine();
    res.status(200).json({ message: "Virtual machine successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete virtual machine" });
  }
};

/**
 * Configures all resources to enable creation of a virtual machine
 * @route GET /configure
 * @returns {Promise<object>} A promise that resolves to a string message of success
 */
const configureResources = async (req, res) => {
  try {
    await createResourceGroup();
    await createVnet();
    const subnetInfo = await getSubnetInfo();
    await createPublicIP();
    await createNIC(subnetInfo);
    res.status(200).json({ message: "All resources successfully configured" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to configure resources" });
  }
};

module.exports = {
  test,
  configureResources,
  stopVM,
  startVM,
  createVM,
  deleteVM,
};
