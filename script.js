let horarioActual = "A";
let vistaActual = "semana";
let fechaActual = new Date();
let eventoEditando = null;

let horarios = {
    A: [],
    B: []
};

const calendario = document.getElementById("calendario");
const tituloCalendario = document.getElementById("tituloCalendario");
const modal = document.getElementById("modal");
const todoElDia = document.getElementById("todoElDia");
const horaInicio = document.getElementById("horaInicio");
const horaFin = document.getElementById("horaFin");

const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
];

const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

function guardarDatos() {
    localStorage.setItem("horarios", JSON.stringify(horarios));
}

function cargarDatos() {
    const datos = localStorage.getItem("horarios");

    if (datos) {
        try {
            horarios = JSON.parse(datos);

            if (!horarios.A) horarios.A = [];
            if (!horarios.B) horarios.B = [];

        } catch (error) {
            console.error("Error al cargar los horarios:", error);

            horarios = {
                A: [],
                B: []
            };
        }
    }
}

function obtenerEventos() {

    if (horarioActual === "AMBOS") {

        return [
            ...horarios.A.map(evento => ({
                ...evento,
                horarioOrigen: "A"
            })),
            ...horarios.B.map(evento => ({
                ...evento,
                horarioOrigen: "B"
            }))
        ];

    }

    return horarios[horarioActual];
}

function mostrarCalendario() {
    if (vistaActual === "semana") {
        mostrarSemana();
    } else {
        mostrarMes();
    }
}

function mostrarSemana() {
    calendario.innerHTML = "";

    tituloCalendario.textContent = "Horario semanal";

    const contenedor = document.createElement("div");
    contenedor.className = "calendario-semana";

    const hoy = new Date();
    const diaActual = hoy.getDay();

    let lunes = new Date(hoy);

    if (diaActual === 0) {
        lunes.setDate(hoy.getDate() - 6);
    } else {
        lunes.setDate(hoy.getDate() - (diaActual - 1));
    }

    for (let dia = 1; dia <= 7; dia++) {

        const columna = document.createElement("div");
        columna.className = "dia";

        const fechaDia = new Date(lunes);
        fechaDia.setDate(lunes.getDate() + dia - 1);

        const fechaTexto =
            fechaDia.toISOString().split("T")[0];

        const nombre = document.createElement("div");
        nombre.className = "nombre-dia";

        nombre.textContent =
            `${nombresDias[fechaDia.getDay()]} ${fechaDia.getDate()}/${fechaDia.getMonth() + 1}`;

        const eventos = document.createElement("div");
        eventos.className = "eventos";

        const eventosDia =
            obtenerEventos()
                .filter(evento => evento.fecha === fechaTexto);

        eventosDia.sort((a, b) =>
            (a.inicio || "").localeCompare(b.inicio || "")
        );

        eventosDia.forEach(evento => {

            const elemento = document.createElement("div");

            elemento.className = "evento";
            elemento.style.background = evento.color;

            const creador =
                evento.horarioOrigen === "A"
                    ? "Bruno"
                    : "Mauro";

            const horario =
                evento.todoElDia
                    ? "Todo el día"
                    : `${evento.inicio} - ${evento.fin}`;

            elemento.innerHTML = `
                <strong>${evento.nombre}</strong>

                ${
                    horarioActual === "AMBOS"
                        ? `<small>${creador}</small>`
                        : ""
                }

                <span>${horario}</span>
            `;

            elemento.onclick = () =>
                editarEvento(evento);

            eventos.appendChild(elemento);
        });

        columna.appendChild(nombre);
        columna.appendChild(eventos);

        contenedor.appendChild(columna);
    }

    calendario.appendChild(contenedor);
}

function mostrarMes() {
    calendario.innerHTML = "";

    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    tituloCalendario.textContent =
        `${nombresMeses[mes]} ${año}`;

    const contenedor = document.createElement("div");
    contenedor.className = "calendario-mes";

    const diasSemana = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo"
    ];

    diasSemana.forEach(dia => {

        const elemento = document.createElement("div");

        elemento.className = "cabecera-mes";
        elemento.textContent = dia;

        contenedor.appendChild(elemento);
    });

    let primerDia =
        new Date(año, mes, 1).getDay();

    if (primerDia === 0) {
        primerDia = 7;
    }

    const diasMes =
        new Date(año, mes + 1, 0).getDate();

    for (let i = 1; i < primerDia; i++) {

        const vacio =
            document.createElement("div");

        vacio.className = "dia-mes";

        contenedor.appendChild(vacio);
    }

    for (let dia = 1; dia <= diasMes; dia++) {

        const elemento =
            document.createElement("div");

        elemento.className = "dia-mes";

        const numero =
            document.createElement("div");

        numero.className = "numero-dia";
        numero.textContent = dia;

        elemento.appendChild(numero);

        const mesTexto =
            String(mes + 1).padStart(2, "0");

        const diaTexto =
            String(dia).padStart(2, "0");

        const fechaTexto =
            `${año}-${mesTexto}-${diaTexto}`;

        const eventosDia =
            obtenerEventos()
                .filter(evento =>
                    evento.fecha === fechaTexto
                );

        eventosDia.sort((a, b) =>
            (a.inicio || "").localeCompare(b.inicio || "")
        );

        eventosDia.forEach(evento => {

            const eventoElemento =
                document.createElement("div");

            eventoElemento.className =
                "evento-mes";

            eventoElemento.style.background =
                evento.color;

            const creador =
                evento.horarioOrigen === "A"
                    ? "Bruno"
                    : "Mauro";

            const horario =
                evento.todoElDia
                    ? "Todo el día"
                    : `${evento.inicio} ${evento.nombre}`;

            eventoElemento.innerHTML = evento.todoElDia
                ? `
                    ${evento.nombre}
                    <small>
                        Todo el día
                        ${
                            horarioActual === "AMBOS"
                                ? `(${creador})`
                                : ""
                        }
                    </small>
                  `
                : `
                    ${evento.inicio} ${evento.nombre}
                    ${
                        horarioActual === "AMBOS"
                            ? `<small>(${creador})</small>`
                            : ""
                    }
                  `;

            eventoElemento.onclick = () =>
                editarEvento(evento);

            elemento.appendChild(eventoElemento);
        });

        contenedor.appendChild(elemento);
    }

    calendario.appendChild(contenedor);
}

function actualizarHoras() {

    if (todoElDia.checked) {

        horaInicio.disabled = true;
        horaFin.disabled = true;

        horaInicio.value = "";
        horaFin.value = "";

    } else {

        horaInicio.disabled = false;
        horaFin.disabled = false;
    }
}

todoElDia.addEventListener("change", actualizarHoras);

function abrirModal() {

    if (horarioActual === "AMBOS") {
        alert("Selecciona Bruno o Mauro para añadir un evento.");
        return;
    }

    eventoEditando = null;

    document.getElementById("tituloModal").textContent =
        "Añadir evento";

    document.getElementById("nombreEvento").value = "";
    document.getElementById("fechaEvento").value = "";
    horaInicio.value = "";
    horaFin.value = "";

    todoElDia.checked = false;
    actualizarHoras();

    document.getElementById("colorEvento").value =
        "#6366f1";

    document.getElementById("botonEliminar").style.display =
        "none";

    modal.classList.remove("oculto");
}

function cerrarModal() {

    modal.classList.add("oculto");

    eventoEditando = null;
}

function editarEvento(evento) {

    eventoEditando = evento;

    document.getElementById("tituloModal").textContent =
        "Editar evento";

    document.getElementById("nombreEvento").value =
        evento.nombre;

    document.getElementById("fechaEvento").value =
        evento.fecha || "";

    horaInicio.value =
        evento.inicio || "";

    horaFin.value =
        evento.fin || "";

    todoElDia.checked =
        evento.todoElDia === true;

    actualizarHoras();

    document.getElementById("colorEvento").value =
        evento.color;

    document.getElementById("botonEliminar").style.display =
        "block";

    modal.classList.remove("oculto");
}

function guardarEvento() {

    const nombre =
        document.getElementById("nombreEvento")
            .value.trim();

    const fecha =
        document.getElementById("fechaEvento")
            .value;

    const inicio =
        horaInicio.value;

    const fin =
        horaFin.value;

    const color =
        document.getElementById("colorEvento")
            .value;

    const esTodoElDia =
        todoElDia.checked;

    if (!nombre || !fecha) {

        alert("Completa el nombre y la fecha.");

        return;
    }

    if (!esTodoElDia && (!inicio || !fin)) {

        alert("Introduce las horas o marca 'Todo el día'.");

        return;
    }

    if (!esTodoElDia && inicio >= fin) {

        alert(
            "La hora de finalización debe ser posterior."
        );

        return;
    }

    if (eventoEditando) {

        eventoEditando.nombre = nombre;
        eventoEditando.fecha = fecha;
        eventoEditando.inicio = esTodoElDia ? "" : inicio;
        eventoEditando.fin = esTodoElDia ? "" : fin;
        eventoEditando.color = color;
        eventoEditando.todoElDia = esTodoElDia;

    } else {

        horarios[horarioActual].push({

            id: Date.now(),

            nombre: nombre,

            fecha: fecha,

            inicio: esTodoElDia ? "" : inicio,

            fin: esTodoElDia ? "" : fin,

            color: color,

            todoElDia: esTodoElDia
        });
    }

    guardarDatos();

    cerrarModal();

    mostrarCalendario();
}

function eliminarEvento() {

    if (!eventoEditando) {
        return;
    }

    const confirmar =
        confirm(
            `¿Quieres eliminar "${eventoEditando.nombre}"?`
        );

    if (!confirmar) {
        return;
    }

    let horarioEliminar = horarioActual;

    if (eventoEditando.horarioOrigen) {
        horarioEliminar = eventoEditando.horarioOrigen;
    }

    const eventos =
        horarios[horarioEliminar];

    const indice =
        eventos.indexOf(eventoEditando);

    if (indice !== -1) {

        eventos.splice(indice, 1);

    } else {

        horarios[horarioEliminar] =
            eventos.filter(evento =>
                evento.id !== eventoEditando.id
            );
    }

    guardarDatos();

    cerrarModal();

    mostrarCalendario();
}

document.getElementById("horarioA").onclick = () => {

    horarioActual = "A";

    document.getElementById("horarioA")
        .classList.add("active");

    document.getElementById("horarioB")
        .classList.remove("active");

    document.getElementById("horarioAmbos")
        .classList.remove("active");

    mostrarCalendario();
};

document.getElementById("horarioB").onclick = () => {

    horarioActual = "B";

    document.getElementById("horarioB")
        .classList.add("active");

    document.getElementById("horarioA")
        .classList.remove("active");

    document.getElementById("horarioAmbos")
        .classList.remove("active");

    mostrarCalendario();
};

document.getElementById("horarioAmbos").onclick = () => {

    horarioActual = "AMBOS";

    document.getElementById("horarioAmbos")
        .classList.add("active");

    document.getElementById("horarioA")
        .classList.remove("active");

    document.getElementById("horarioB")
        .classList.remove("active");

    mostrarCalendario();
};

document.getElementById("vistaSemana").onclick = () => {

    vistaActual = "semana";

    document.getElementById("vistaSemana")
        .classList.add("active");

    document.getElementById("vistaMes")
        .classList.remove("active");

    mostrarCalendario();
};

document.getElementById("vistaMes").onclick = () => {

    vistaActual = "mes";

    document.getElementById("vistaMes")
        .classList.add("active");

    document.getElementById("vistaSemana")
        .classList.remove("active");

    mostrarCalendario();
};

document.getElementById("btnAnadirEvento").onclick =
    abrirModal;

document.getElementById("cancelarEvento").onclick =
    cerrarModal;

document.getElementById("guardarEvento").onclick =
    guardarEvento;

document.getElementById("botonEliminar").onclick =
    eliminarEvento;

document.getElementById("mesAnterior").onclick = () => {

    fechaActual.setMonth(
        fechaActual.getMonth() - 1
    );

    mostrarCalendario();
};

document.getElementById("mesSiguiente").onclick = () => {

    fechaActual.setMonth(
        fechaActual.getMonth() + 1
    );

    mostrarCalendario();
};

cargarDatos();
mostrarCalendario();
