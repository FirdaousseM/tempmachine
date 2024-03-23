const apiUrl = "http://localhost:8282";
export const configureResources = async () => {
  try {
    const response = await fetch(apiUrl + "/vm/configure");
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const getVirtualMachine = async () => {
  try {
    const response = await fetch(apiUrl + "/vm/get");
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const getOsList = async () => {
  try {
    const response = await fetch(apiUrl + "/vm/types");
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const getCounter = async () => {
  try {
    const response = await fetch(apiUrl + "/vm/counter");
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const createVirtualMachine = async (data) => {
  try {
    const dataToSend = {
      data: data,
      user: localStorage.getItem("user"),
    };
    const response = await fetch(apiUrl + "/vm/create", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const deleteVirtualMachine = async (data) => {
  try {
    const response = await fetch(apiUrl + "/vm/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const startVirtualMachine = async (data) => {
  try {
    const response = await fetch(apiUrl + "/vm/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const stopVirtualMachine = async (data) => {
  try {
    const response = await fetch(apiUrl + "/vm/stop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
