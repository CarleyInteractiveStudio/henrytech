const { createClient } = supabase;

const supabase = createClient(
  "https://dqpdhergtcyqvmjirlzv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Tu clave pública real aquí
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

// Registro
async function registrarUsuario(e) {
  e.preventDefault();
  const email = document.getElementById("emailReg").value;
  const password = document.getElementById("passReg").value;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert("Erè pandan enskripsyon: " + error.message);
  } else {
    alert("Enskripsyon reyalize! Tcheke imèl ou pou verifye kont lan.");
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
    document.getElementById("userPanelButton").innerHTML = `<button onclick="abrirPanelUsuario()">👤 ${user.email}</button>`;
    e.target.reset();
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
    document.getElementById("userPanelButton").innerHTML = `<button onclick="abrirPanelUsuario()">👤 ${user.email}</button>`;
    mostrarProductos();
  }
}

window.onload = function () {
  document.getElementById("politicaPrivacidad").style.display = "flex";
}

// Confirmación de correo
async function enviarCodigoVerificacion() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Ou pa konekte.");

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  await supabase.from("codigo_verificacion").insert([
    { user_id: user.id, email: user.email, codigo }
  ]);

  alert(`Kòd verifikasyon voye nan: ${user.email}`);
  mostrarConfirmacionCorreo();
}

function mostrarConfirmacionCorreo() {
  const panel = document.createElement("div");
  panel.innerHTML = `
    <div style="background:#fff;padding:1.5rem;border-radius:10px;max-width:400px;margin:2rem auto;">
      <h3>📩 Konfimasyon Imèl</h3>
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

  let contenido = `
    <h3>👤 Itilizatè: ${user.email}</h3>
    ${!confirmado ? `<button onclick="enviarCodigoVerificacion()">📩 Konfime Imèl</button>` : `<p style="color:green;">✅ Imèl konfime</p>`}
  `;

  const panel = document.createElement("div");
  panel.id = "userPanel";
  panel.innerHTML = contenido;
  document.getElementById("userPanel").innerHTML = "";
  document.getElementById("userPanel").appendChild(panel);
}

// Mostrar catálogo sin precios
function mostrarProductos() {
  const productos = [
    { nombre: "Kamera Sekirite 1", descripcion: "Kamera pou sekirite estanda", imagen: "images/camaradevigilancia1.jpg" },
    { nombre: "Kamera Sekirite 2", descripcion: "Kamera 360° ak rotasyon", imagen: "images/camaradevigilancia2.jpg" },
    { nombre: "Kamera WiFi 360", descripcion: "Kamera entelijan san fil", imagen: "images/camerawifi.jpg" },
    { nombre: "Kit Starlink", descripcion: "Kit konplè pou koneksyon satelit", imagen: "images/starlinck.jpg" },
    { nombre: "Foto Starlink 1", descripcion: "Altènatif vizyèl pou Starlink", imagen: "images/starlinck1.jpg" },
    { nombre: "Foto Starlink 2", descripcion: "Altènatif vizyèl pou Starlink", imagen: "images/starlinck2.jpg" },
    { nombre: "Foto Starlink 3", descripcion: "Altènatif vizyèl pou Starlink", imagen: "images/starlinck3.jpg" }
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
      <button onclick="solicitarProducto('${producto.nombre}')">🤝 Mande Kontak</button>
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
      <option value="">Chwazi kote livrezon      <option>Thomonde</option>
      <option>Hinche</option>
      <option>Peligre</option>
      <option>Cap Haïtien</option>
    </select>
    <input type="text" id="whatsappUser" placeholder="Nimewo WhatsApp ou" required />
    <textarea id="notes" placeholder="Nòt pou livrezon (opsyonèl)"></textarea>
    <button type="submit">📩 Voye demann</button>
  `;

  form.onsubmit = async function (e) {
    e.preventDefault();
    const zona = document.getElementById("zonaEntrega").value;
    const whatsapp = document.getElementById("whatsappUser").value;
    const notes = document.getElementById("notes").value;

    const payload = {
      produit: nombre,
      email: user.email,
      whatsapp,
      zona,
      nòt: notes
    };

    await fetch("https://formsubmit.co/ajax/harryfrancois5@outlook.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert("✅ Demann ou voye! Papa ou pral kontakte ou sou WhatsApp.");
    form.reset();
  };

  form.style.background = "#fff";
  form.style.padding = "1.5rem";
  form.style.borderRadius = "10px";
  form.style.margin = "2rem auto";
  form.style.maxWidth = "400px";

  document.body.appendChild(form);
}