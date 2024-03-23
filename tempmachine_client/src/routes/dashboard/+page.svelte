<script>
  import { createVirtualMachine } from "$lib/api/azureApi";

  export let data;
  let vmCreated;
  let osInput = "linux";
  let timerInput = 10;
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  console.log(loggedUser);
  const handleSubmit = async (event) => {
    event.preventDefault();
    let timer = timerInput ? timerInput : 10;
    const dataVMCreation = {
      platform: osInput,
      timeToWait: parseInt(timer),
    };
    console.log(dataVMCreation);
    vmCreated = await createVirtualMachine(dataVMCreation);
  };
</script>

<main>
  <h1>Gestion des machines virtuelles</h1>

  {#if loggedUser.access != "NONE"}
    <form>
      <div>
        <label for="osType">Type de machine</label>
        <select name="osType" id="osType" bind:value={osInput}>
          <option value={data.osList.linux.name}>
            {data.osList.linux.name}
          </option>
          {#if loggedUser.access == "ALL"}
            <option value={data.osList.windows.name}
              >{data.osList.windows.name}
            </option>
          {/if}
        </select>
      </div>
      <div>
        <label for="timerInput">Durée de vie</label>
        <input
          bind:value={timerInput}
          type="number"
          name="timer"
          id="timerInput"
          max="10"
          min="1"
        />
        <span>minutes</span>
      </div>
      <div>
        <input
          on:click={handleSubmit}
          type="submit"
          value="Lancer une machine virtuelle"
        />
      </div>
    </form>

    {#if vmCreated}
       <span>Machine créée</span>
    {/if}
  {:else}
    <div>
      <span>
        Vous n'avez pas les droits nécéssaires pour gérer des machines
        virtuelles
      </span>
      <a href="/">Changer de compte</a>
    </div>
  {/if}
</main>
