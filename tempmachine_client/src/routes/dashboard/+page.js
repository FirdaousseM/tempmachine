import { getOsList, configureResources } from "$lib/api/azureApi";
import { getCounter } from "../../lib/api/azureApi";
import { goto } from "$app/navigation";

export async function load() {
  if (!localStorage.getItem("user")) {
    goto("/");
  }

  const osList = await getOsList();

  return {
    osList: osList,
  };
}
