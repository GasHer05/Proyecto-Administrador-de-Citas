// Selectores
const pacienteInput = document.querySelector("#paciente");
const propietarioInput = document.querySelector("#propietario");
const emailInput = document.querySelector("#email");
const fechaInput = document.querySelector("#fecha");
const sintomasInput = document.querySelector("#sintomas");

const formulario = document.querySelector("#formulario-cita");

const formularioInput = document.querySelector(
  '#formulario-cita input[type="submit"]'
);

const contenedorCitas = document.querySelector("#citas");

const btnEditar = document.querySelector(".btn-editar");

// Eventos
pacienteInput.addEventListener("change", datosCita);
propietarioInput.addEventListener("change", datosCita);
emailInput.addEventListener("change", datosCita);
fechaInput.addEventListener("change", datosCita);
sintomasInput.addEventListener("change", datosCita);

formulario.addEventListener("submit", submitCita);

let editando = false;

// Objeto de Cita
const citaObj = {
  id: generarId(),
  paciente: "",
  propietario: "",
  email: "",
  fecha: "",
  sintomas: "",
};

class Notificacion {
  constructor({ texto, tipo }) {
    this.texto = texto;
    this.tipo = tipo;
    this.mostrar();
  }
  mostrar() {
    //Crear la notificaccion
    const alerta = document.createElement("DIV");
    alerta.classList.add(
      "text-center",
      "w-full",
      "p-3",
      "text-white",
      "my-5",
      "alert",
      "uppercase",
      "font-bold",
      "text-sm"
    );
    //Eliminar alertas duplicadas
    const alertaPrevia = document.querySelector(".alert");
    if (alertaPrevia) {
      alertaPrevia.remove();
    }
    //Si es de tipo error, agrega una clase
    this.tipo === "error"
      ? alerta.classList.add("bg-red-500")
      : alerta.classList.add("bg-green-500");
    //Mensaje de error
    alerta.textContent = this.texto;
    //Insertar en el DOM
    formulario.parentElement.insertBefore(alerta, formulario);
    //Quitar despues de 5 segundos
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

class AdminCitas {
  constructor() {
    this.citas = [];
  }
  agregar(cita) {
    this.citas = [...this.citas, cita];
    this.mostrar();
  }

  editar(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
    this.mostrar();
  }

  eliminar(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
    this.mostrar();
  }

  mostrar() {
    //Limpiar el HTML
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }

    //Preguntamos si hay citas
    if (this.citas.length === 0) {
      contenedorCitas.innerHTML =
        '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>';
      return;
    }

    //Generando las citas
    this.citas.forEach((cita) => {
      const divCita = document.createElement("div");
      divCita.classList.add(
        "mx-5",
        "my-10",
        "bg-white",
        "shadow-md",
        "px-5",
        "py-10",
        "rounded-xl",
        "p-3"
      );

      const paciente = document.createElement("p");
      paciente.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;

      const propietario = document.createElement("p");
      propietario.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;

      const email = document.createElement("p");
      email.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;

      const fecha = document.createElement("p");
      fecha.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;

      const sintomas = document.createElement("p");
      sintomas.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

      //Botones de eliminar y editar
      const btnEditar = document.createElement("button");
      btnEditar.classList.add(
        "py-2",
        "px-10",
        "bg-indigo-600",
        "hover:bg-indigo-700",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2",
        "btn-editar"
      );
      btnEditar.innerHTML = "Editar ";
      const clone = { ...cita };
      btnEditar.onclick = () => cargarEdicion(clone);

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add(
        "py-2",
        "px-10",
        "bg-red-600",
        "hover:bg-red-700",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2"
      );
      btnEliminar.innerHTML = "Eliminar";
      btnEliminar.onclick = () => this.eliminar(cita.id);

      const contenedorBotones = document.createElement("DIV");
      contenedorBotones.classList.add("flex", "justify-between", "mt-10");
      contenedorBotones.appendChild(btnEditar);
      contenedorBotones.appendChild(btnEliminar);

      // Agregar al HTML
      divCita.appendChild(paciente);
      divCita.appendChild(propietario);
      divCita.appendChild(email);
      divCita.appendChild(fecha);
      divCita.appendChild(sintomas);
      divCita.appendChild(contenedorBotones);
      contenedorCitas.appendChild(divCita);
    });
  }
}

function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
}

const citas = new AdminCitas();

function submitCita(e) {
  e.preventDefault();

  if (Object.values(citaObj).some((valor) => valor.trim() === "")) {
    new Notificacion({
      texto: "Todos los campos son obligatorios",
      tipo: "error",
    });
    return;
  }
  if (editando) {
    citas.editar({ ...citaObj });
    new Notificacion({
      texto: "Guardado Correctamente",
      tipo: "exito",
    });
  } else {
    citas.agregar({ ...citaObj });
    new Notificacion({
      texto: "El Paciente ha sido registrado",
      tipo: "exito",
    });
  }
  formulario.reset();
  reiniciarObjCita();
  formularioInput.value = "Registrar Paciente";
  editando = false;
}

function reiniciarObjCita() {
  //Reiniciar el objeto manera 1
  /*  citaObj.id = generarId() 
  citaObj.paciente = "";
  citaObj.propietario = "";
  citaObj.email = "";
  citaObj.fecha = "";
  citaObj.sintomas = ""; */
  //Reiniciar el objeto manera 2
  Object.assign(citaObj, {
    id: generarId(),
    paciente: "",
    propietario: "",
    email: "",
    fecha: "",
    sintomas: "",
  });
}

function generarId() {
  return Math.random().toString(36).substring(2) + Date.now();
}

function cargarEdicion(cita) {
  Object.assign(citaObj, cita);

  pacienteInput.value = cita.paciente;
  propietarioInput.value = cita.propietario;
  emailInput.value = cita.email;
  fechaInput.value = cita.fecha;
  sintomasInput.value = cita.sintomas;

  editando = true;

  formularioInput.value = "Guardar cambios";
}
