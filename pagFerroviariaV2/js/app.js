var nombre = document.querySelector(".inpNom");
var ticketDistino = document.querySelector("#eligoTicketDestino");
var dni = document.querySelector(".inpDNI");
var cantidad = document.querySelector(".inpCantidad");

var btnSoli = document.querySelector(".boton");

//Variables de errores
var nomErr = document.querySelector(".nomErr");
var optErr = document.querySelector(".optErr");
var dniErr = document.querySelector(".dniErr");
var cantErr = document.querySelector(".cantErr");

// Nombre y apellido (mismo patrón sirve para ambos)
const regexNombreApellido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/;

// DNI argentino (7 u 8 dígitos, sin puntos)
const regexDNI = /^\d{7,8}$/;

// Guardamos el resultado de la validación del ticket acá,
// porque esa validación es async (depende del fetch)
let ticketValido = false;


// ---- Validaciones que MUESTRAN error y se disparan con el evento de SU propio campo ----

function validarNom(){
  const nom = nombre.value.trim();
  const esValido = regexNombreApellido.test(nom);
  nomErr.textContent = esValido ? "" : "Nombre invalido";
  validarFormulario();
  return esValido;
}

function validarDNI(){
  const identidad = dni.value.trim();
  const esValido = regexDNI.test(identidad);
  dniErr.textContent = esValido ? "" : "DNI Invalido";
  validarFormulario();
  return esValido;
}

function validadCantidad(){
  const cantTexto = cantidad.value.trim();
  const cant = Number(cantTexto);
  let esValido = true;

  if(cantTexto === "" || cant === 0){
    cantErr.textContent = "no puede faltar un numero o ser 0 tiene que ser mayor";
    esValido = false;
  } else if(cant > 6){
    cantErr.textContent = "el maximo es 6";
    esValido = false;
  } else {
    cantErr.textContent = "";
  }

  validarFormulario();
  return esValido;
}

function validarTicket(){

  fetch("json/datos.json")
    .then((respuesta) => respuesta.json())
    .then((dato) => {

      const valorSeleccionado = ticketDistino.value;

      if (valorSeleccionado === "") {
        optErr.textContent = "Por favor seleccioná una opción";
        ticketValido = false;
        validarFormulario();
        return;
      }

      const indice = Number(valorSeleccionado);
      const destinoElegido = dato[indice];

      if (destinoElegido) {
        console.log("Coincide con:", destinoElegido);

        if (destinoElegido.tipoTicket === "local") {
          optErr.textContent = "Es un ticket local";
        } else {
          optErr.textContent = `Es un ticket de tipo: ${destinoElegido.tipoTicket}`;
        }

        ticketValido = true;

      } else {
        optErr.textContent = "Opción no válida";
        ticketValido = false;
      }

      validarFormulario();

    })
    .catch((error) => {
      console.error("Error:", error);
      ticketValido = false;
      validarFormulario();
    });

}


// ---- Chequeo silencioso: no toca ningún textContent, solo dice si está todo OK ----

function esFormularioValido(){
  const nomOk = regexNombreApellido.test(nombre.value.trim());
  const dniOk = regexDNI.test(dni.value.trim());

  const cantTexto = cantidad.value.trim();
  const cant = Number(cantTexto);
  const cantOk = cantTexto !== "" && cant > 0 && cant <= 6;

  return nomOk && dniOk && cantOk && ticketValido;
}

// ---- Habilita/deshabilita el botón según el chequeo silencioso ----

function validarFormulario(){
  btnSoli.disabled = !esFormularioValido();
}


// ---- Listeners: cada campo dispara SU PROPIA validación ----

nombre.addEventListener("input", validarNom);
dni.addEventListener("input", validarDNI);
cantidad.addEventListener("input", validadCantidad);
ticketDistino.addEventListener("change", validarTicket);

// Arrancamos con el botón deshabilitado
btnSoli.disabled = true;


btnSoli.addEventListener("click", function(){


alert("Se envio todo");



});