function handleLogin(response) {
  const user = decodeJwt(response.credential);
  document.body.insertAdjacentHTML("afterbegin",
    `<p class="bienvenida">Bonjou ${user.name} (${user.email})</p>`);
}

function decodeJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}