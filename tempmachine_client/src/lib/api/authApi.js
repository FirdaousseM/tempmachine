import { goto } from "$app/navigation";

const apiUrl = "http://localhost:8282";
export const login = async (data) => {
  try {
    const response = await fetch(apiUrl + "/auth/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), 
    });
    if (response.ok) {
      const json = await response.json();
      console.log(json);
      goto("/dashboard");
      return json;
    }
  } catch (error) {
    console.error(error);
  }
};
