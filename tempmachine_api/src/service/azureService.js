const {
  credentials,
  subscriptionId,
} = require("../../config/azureCredentials");
const { ComputeManagementClient } = require("@azure/arm-compute");
const { ResourceManagementClient } = require("@azure/arm-resources");
const { NetworkManagementClient } = require("@azure/arm-network");

const { randomNumber } = require("../utils/utils");

let nicInfo = {};

const location = "francecentral";
const adminUsername = "userlogin";
const adminPassword = "Pa$$w0rd91";

const resourceGroupName = "fm-groupe-ressource-test" + randomNumber();
const vnetName = "azure-sample-vnet" + randomNumber();
const subnetName = "azure-sample-subnet" + randomNumber();
const ipConfigName = "azure-sample-ip-config" + randomNumber();
const networkInterfaceName = "azure-sample-nic" + randomNumber();
const vmName = "VmName" + randomNumber();
const domainNameLabel = "testdomainname" + randomNumber();
const publicIPName = "testpip" + randomNumber();

const vmReference = {
  linux: {
    name: "linux",
    publisher: "Canonical",
    offer: "UbuntuServer",
    sku: "16.04.0-LTS",
    version: "latest",
  },
  windows: {
    name: "windows",
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
  // const pubIp = networkManager.publicIPAddresses.get(
  //   resourceGroupName,
  //   publicIPName
  // );
  // console.log("publicIP already in use : " + pubIp);
  // if (pubIp != null) {
  console.log("Creating public IP: " + publicIPName);
  return await networkManager.publicIPAddresses.beginCreateOrUpdateAndWait(
    resourceGroupName,
    publicIPName,
    publicIPParameters
  );
  // }
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

let remainingTime;

const startTimer = (timeToWait) => {
  console.log(timeToWait);
  timeToWait *= 60;
  let remainingTime = timeToWait;

  const countDown = setInterval(() => {
    remainingTime--;

    console.log(remainingTime);

    let minutes = Math.floor(remainingTime / 60);
    let seconds = Math.floor(remainingTime % 60);

    console.log(minutes + "min " + seconds + "sec ");

    if (remainingTime <= 0) {
      console.log("Compte à rebours terminé");
      deleteVirtualMachine();
      clearInterval(countDown);
    }
  }, 1000);
};

const getRemainingTime = () => {
  return {
    minutes: Math.floor(remainingTime / 60),
    seconds: Math.floor(remainingTime % 60),
  };
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
    if (req.body.user.access != "NONE") {
      let os;
      if (req.body.user.access == "ALL") {
        os = req.body.data.platform;
      } else {
        os = "linux";
      }
      timeToWait = req.body.data.timeToWait;
      await createVirtualMachine(vmReference[os], nicInfo.id);
      const virtualMachine = getVirtualMachine();
      res.json(virtualMachine);
      startTimer(timeToWait);
    }
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
const configureResources = async () => {
  try {
    await createResourceGroup();
    await createVnet();
    const subnetInfo = await getSubnetInfo();
    await createPublicIP();
    nicInfo = await createNIC(subnetInfo);
    console.log("All resources successfully configured");
    // res.status(200).json({ message: "All resources successfully configured" });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: "Failed to configure resources" });
  }
};

/**
 * Returns
 * @route GET /list
 * @returns {Promise<object[]>} A promise that resolves to an array of string
 */
const getOsList = async (req, res) => {
  try {
    if (req.param.access == "NONE") {
      res.json(null);
    } else if (req.param.access == "LINUX") {
      res.json(vmReference.linux);
    } else {
      res.json(vmReference);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retreive osList" });
  }
};

/**
 * Returns
 * @route GET /counter
 * @returns {Promise<object>} A promise that resolves to an object with time informations
 */
const getCounter = async (req, res) => {
  try {
    res.json(getRemainingTime());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retreive counter" });
  }
};

module.exports = {
  configureResources,
  stopVM,
  startVM,
  createVM,
  deleteVM,
  getOsList,
  getCounter,
};
