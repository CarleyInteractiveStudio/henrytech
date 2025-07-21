// Inicializar Supabase
const supabase = window.supabase.createClient(
  "https://dqpdhergtcyqvmjirlzv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcGRoZXJndGN5cXZtamlybHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4Njc2OTIsImV4cCI6MjA2ODQ0MzY5Mn0.Z-LE-uUE3k9BqZWstfsTAxOiAu90dD0YwaK0uSH1WJw"
);

// Mostrar formularios
function mostrarRegistro() {
  document.getElementById("authButtons").style.display = "none";
  document.getElementById("formLogin").style.display = "none";
  document.getElementById("formRegistro").style.display = "block";
}

function mostrarLogin() {
  document.getElementById("authButtons").style.display = "none";
  document.getElementById("formRegistro").style.display = "none";
  document.getElementById("formLogin").style.display = "block";
}

function volverMenu() {
  document.getElementById("formRegistro").style.display = "none";
  document.getElementById("formLogin").style.display = "none";
  document.getElementById("authButtons").style.display = "block";
}

// Registro con envío de código
async function registrarUsuario(e) {
  e.preventDefault();
  const email = document.getElementById("emailReg").value;
  const password = document.getElementById("passReg").value;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert("Erè pandan enskripsyon: " + error.message);
  } else {
    const user = data.user;
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    await supabase.from("codigo_verificacion").insert([{ user_id: user.id, email, codigo }]);
    alert("✅ Enskripsyon reyalize! Tcheke imèl ou pou verifye kont lan.");
    e.target.reset();
    volverMenu();
  }
}

// Login
async function iniciarSesion(e) {
  e.preventDefault();
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passLogin").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Login erè: " + error.message);
  } else {
    const user = data.user;
    localStorage.setItem("usuarioActivo", JSON.stringify(user));
    document.getElementById("saludoHeader").textContent = `Bonjou, ${user.email}!`;
    document.getElementById("authButtons").style.display = "none";
    document.getElementById("formLogin").style.display = "none";
    document.getElementById("catalogoProductos").style.display = "block";
    document.getElementById("userPanelButton").style.display = "block";
    document.getElementById("userEmail").textContent = user.email;
    mostrarProductos();
  }
}

// Privacidad
function aceptarPrivacidad() {
  document.getElementById("politicaPrivacidad").style.display = "none";
  verificarSesionAutomatica();
}

function verificarSesionAutomatica() {
  const user = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (user) {
    document.getElementById("saludoHeader").textContent = `Bonjou, ${user.email}!`;
    document.getElementById("authButtons").style.display = "none";
    document.getElementById("catalogoProductos").style.display = "block";
    document.getElementById("userPanelButton").style.display = "block";
    document.getElementById("userEmail").textContent = user.email;
    mostrarProductos();
  }
}

window.onload = function () {
  document.getElementById("politicaPrivacidad").style.display = "flex";
}

// Código de verificación por correo
function mostrarConfirmacionCorreo() {
  const panel = document.createElement("div");
  panel.innerHTML = `
    <div style="background:#fff;padding:1.5rem;border-radius:10px;max-width:400px;margin:2rem auto;">
      <h3>📧 Konfimasyon Imèl</h3>
      <p>Antre kòd sekirite ou resevwa nan imèl la:</p>
      <input type="text" id="codigoIngresado" placeholder="Kòd 6 chif yo" />
      <button onclick="validarCodigo()">Konfime</button>
    </div>
  `;
  document.body.appendChild(panel);
}

async function validarCodigo() {
  const { data: { user } } = await supabase.auth.getUser();
  const ingresado = document.getElementById("codigoIngresado").value;

  const { data } = await supabase
    .from("codigo_verificacion")
    .select("*")
    .eq("user_id", user.id)
    .eq("codigo", ingresado)
    .eq("confirmado", false)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) {
    alert("Kòd pa valab.");
    return;
  }

  await supabase
    .from("codigo_verificacion")
    .update({ confirmado: true })
    .eq("id", data[0].id);

  alert("✅ Imèl konfime ak siksè!");
}

// Panel del usuario
async function abrirPanelUsuario() {
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("codigo_verificacion")
    .select("confirmado")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const confirmado = data && data.length > 0 ? data[0].confirmado : false;

  const panel = document.getElementById("menuUsuario");
  panel.innerHTML = `
    <button onclick="mostrarCarrito()">🛒 Panier</button>
    <button onclick="mostrarFavoritos()">❤️ Favori</button>
    <button onclick="mostrarHistorial()">📜 Demann</button>
    ${!confirmado ? `<button onclick="mostrarConfirmacionCorreo()">📧 Konfime Imèl</button>` : `<p style="color:green;">✅ Imèl konfime</p>`}
  `;
}

// Toggle menú del usuario
function toggleMenuUsuario() {
  const menu = document.getElementById("menuUsuario");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

// Mostrar productos
function mostrarProductos() {
  const productos = [
    { nombre: "Kamera Sekirite 1", descripcion: "Kamera pou sekirite estanda", imagen: "assets/img/camaradevigilancia1.jpg" },
    { nombre: "Kamera Sekirite 2", descripcion: "Kamera 360° ak rotasyon", imagen: "assets/img/camaradevigilancia2.jpg" },
    { nombre: "Kamera WiFi 360", descripcion: "Kamera entelijan san fil", imagen: "assets/img/camerawifi.jpg" },
    { nombre: "Kit Starlink", descripcion: "Kit konplè pou  Starlink", imagen: "assets/img/Starlinck.jpg" },
    { nombre: "Starlink", descripcion: "Altènatif vizyèl pou Starlink", imagen: "assets/img/Starlinck1.jpg" },
    { nombre: "Altèn pou Starlink", descripcion: "Altènatif vizyèl pou Starlink", imagen: "assets/img/Starlinck2.jpg" },
    { nombre: "Starlink kople pou kay ou", descripcion: "Altènatif vizyèl pou Starlink", imagen: "assets/img/Starlinck3.jpg" }
  ];

  const contenedor = document.getElementById("catalogoProductos");
  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "producto fadeIn";
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <button onclick="solicitarProducto('${producto.nombre}')">🤝 mande youn la dan</button>
    `;
    contenedor.appendChild(card);
  });
}

// Solicitud de producto
function solicitarProducto(nombre) {
  const user = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!user) return alert("Ou dwe konekte pou voye demann.");

  const form = document.createElement("form");
  form.innerHTML = `
    <h3>📝 Demann pou: ${nombre}</h3>
    <select id="zonaEntrega" required>
      <option value="">Chwazi kote livrezon</option>
      <option>Thomonde</option>
      <option>Hinche</option>
      <option>Peligre</option>
      <option>Cap Haïtien</option>
    </select>
    <input type="text" id="whatsappUser" placeholder="Nimewo WhatsApp ou" required />
    <textarea id="notes" placeholder="Nòt pou livrezon (opsyonèl)"></textarea>
    <button type="submit">📧 Voye demann</button>
  `;

  form.onsubmit = async function (e) {
    e.preventDefault();
    const zona = document.getElementById("zonaEntrega").value;
    const whatsapp = document.getElementById("whatsappUser").value;
    const notes = document.getElementById("notes").value;
    const timestamp = new Date().toLocaleString("es-DO");

    const payload = {
      produit: nombre,
      email: user.email,
      whatsapp,
      zona,
      nòt: notes,
      fechaHora: timestamp
    };

    const response = await fetch("https://formsubmit.co/ajax/harryfrancois5@outlook.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      window.location.href = "gracias.html";
    } else {
      alert("❌ Erè pandan voye demann. Tanpri tcheke koneksyon ou oswa eseye ankò.");
    }
  };

  form.style.background = "#fff";
  form.style.padding = "1.5rem";
  form.style.borderRadius = "10px";
  form.style.margin = "2rem auto";
  form.style.maxWidth = "400px";

  document.body.appendChild(form);
}