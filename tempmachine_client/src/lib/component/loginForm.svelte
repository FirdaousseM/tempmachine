<script>
  import { login } from "$lib/api/authApi";
  let emailInput = "";
  let passwordInput = "";
  let user;
  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginData = {
      email: emailInput,
      password: passwordInput,
    };
    user = await login(loginData);
    localStorage.setItem("user", JSON.stringify(user.data));
  };
</script>

<main>
  <h2>Connexion</h2>
  <form>
    <div>
      <label for="email">Email</label>
      <input type="text" name="email" id="email" bind:value={emailInput} />
    </div>
    <div>
      <label for="password">password</label>
      <input
        type="password"
        name="password"
        id="password"
        bind:value={passwordInput}
      />
    </div>
    <input on:click={handleSubmit} type="submit" value="Connexion" />
  </form>
</main>
