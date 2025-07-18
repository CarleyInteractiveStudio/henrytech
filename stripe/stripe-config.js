const stripePublicKey = "pk_test_xxxxxx"; // Reemplaza con tu clave pública

// Redirige al checkout
function pagarProducto(producto) {
  fetch("/crear-sesion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto })
  })
  .then(res => res.json())
  .then(data => {
    const stripe = Stripe(stripePublicKey);
    stripe.redirectToCheckout({ sessionId: data.id });
  });
}