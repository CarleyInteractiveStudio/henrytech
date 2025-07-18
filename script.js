// Mostrar formulario de registro
function mostrarRegistro() {
  document.getElementById("authButtons").style.display = "none";
  document.getElementById("formLogin").style.display = "none";
  document.getElementById("formRegistro").style.display = "block";
}

// Mostrar formulario de login
function mostrarLogin() {
  document.getElementById("authButtons").style.display = "none";
  document.getElementById("formRegistro").style.display = "none";
  document.getElementById("formLogin").style.display = "block";
}

// Registro de nuevo usuario
document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault();
  const nombre = document.getElementById("nombreReg").value;
  const email = document.getElementById("emailReg").value;
  const pass = document.getElementById("passReg").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.some(u => u.email === email)) {
    alert("Imèl sa deja itilize. Eseye konekte.");
    return;
  }

  usuarios.push({ nombre, email, password: pass });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Kont kreye avèk siksè!");

  document.getElementById("formRegistro").style.display = "none";
  document.getElementById("authButtons").style.display = "block";
  e.target.reset();
});

// Inicio de sesión
document.getElementById("formLogin").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("emailLogin").value;
  const pass = document.getElementById("passLogin").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.password === pass);

  if (usuario) {
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    alert("Byenveni " + usuario.nombre + "! Ou konekte avèk siksè.");
    document.getElementById("saludoHeader").textContent = `Bonjou, ${usuario.nombre}!`;

    document.getElementById("formLogin").style.display = "none";
    document.getElementById("authButtons").style.display = "none";
    document.getElementById("catalogoProductos").style.display = "block";
    e.target.reset();
  } else {
    alert("Imèl oswa modpas pa kòrèk.");
  }
});

// Abrir panel de producto
function abrirPanel() {
  document.getElementById("panelProducto").style.display = "flex";
}

// Cerrar panel de producto
function cerrarPanel() {
  document.getElementById("panelProducto").style.display = "none";
}