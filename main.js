let costoTotal = 0;
let pagoConTarjeta = 0;
const sumaConTarjeta = (a, b) => a + b;
const comision = x => x * 0.04;
let costoServicio = 0;

// Obtener el elemento <body> del DOM
const body = document.querySelector('body');

// Crear contenedor principal
const container = document.createElement('div');
container.classList.add('container');
body.appendChild(container);

// Crear elemento <div> para mostrar el mensaje de bienvenida
const mensajeBienvenidaDiv = document.createElement('div');
mensajeBienvenidaDiv.textContent = "Que tal bienvenido a tu clínica dental, a continuación mostramos los servicios dentales que tenemos a tu disposición.";
container.appendChild(mensajeBienvenidaDiv);

// Crear elemento <ul> para mostrar los servicios disponibles
const serviciosDisponiblesUl = document.createElement('ul');
const serviciosDentalesData = [
    { nombre: "Limpieza", costo: 150 },
    { nombre: "Extraccion", costo: 500 },
    { nombre: "Endodoncia", costo: 1500 },
    { nombre: "Blanqueamiento", costo: 450 },
    { nombre: "Carillas", costo: 3000 }
];
serviciosDentalesData.forEach(servicio => {
    const servicioLi = document.createElement('li');
    servicioLi.textContent = `${servicio.nombre} $${servicio.costo}`;
    serviciosDisponiblesUl.appendChild(servicioLi);
});
container.appendChild(serviciosDisponiblesUl);

// Verificar si los servicios ya están almacenados en el localStorage
if (!localStorage.getItem('serviciosDentales')) {
    // Almacenar los servicios dentales en formato JSON
    const serviciosDentalesJSON = JSON.stringify(serviciosDentalesData);
    localStorage.setItem('serviciosDentales', serviciosDentalesJSON);
}

// Obtener los servicios dentales del localStorage y convertirlos de nuevo a objetos JavaScript
const serviciosDentalesJSON = localStorage.getItem('serviciosDentales');
const serviciosDentales = JSON.parse(serviciosDentalesJSON);

// Crear contenedor para los servicios agregados
const serviciosAgregadosDiv = document.createElement('div');
container.appendChild(serviciosAgregadosDiv);

// Solicitar servicios al usuario
const solicitarServicios = () => {
    const servicioSeleccionadoTextoHeader = document.createElement('p');
    servicioSeleccionadoTextoHeader.textContent = "Ingresa el servicio que se requiere sin acentos o haz clic en 'Listo' para finalizar";
    container.appendChild(servicioSeleccionadoTextoHeader);

    const servicioSeleccionadoInput = document.createElement('input');
    servicioSeleccionadoInput.type = "text";
    servicioSeleccionadoInput.placeholder = "Ingresa el servicio aqui...";
    container.appendChild(servicioSeleccionadoInput);

    const servicioSeleccionadoButton = document.createElement('button');
    servicioSeleccionadoButton.textContent = "Agregar servicio";
    container.appendChild(servicioSeleccionadoButton);

    const servicioSeleccionadoTexto = document.createElement('p');
    container.appendChild(servicioSeleccionadoTexto);

    const servicioListoButton = document.createElement('button');
    servicioListoButton.textContent = "Listo";
    container.appendChild(servicioListoButton);

    servicioListoButton.addEventListener('click', () => {
        mostrarCostoTotal();
    });

    servicioSeleccionadoButton.addEventListener('click', () => {
        const servicioSeleccionado = servicioSeleccionadoInput.value.toLowerCase();
        
        servicioSeleccionadoInput.value = "";
        if (servicioSeleccionado === "listo") {
            mostrarCostoTotal();
            return;
        }
        const servicioEncontradoIndex = serviciosDentales.findIndex(servicio => servicio.nombre.toLowerCase() === servicioSeleccionado.toLowerCase());
        if (servicioEncontradoIndex !== -1) {
            costoServicio = serviciosDentales[servicioEncontradoIndex].costo;
            costoTotal += costoServicio;
            const servicioAgregadoDiv = document.createElement('div');
            const servicioTexto = document.createElement('span');
            servicioTexto.textContent = `Servicio Agregado: ${servicioSeleccionado} - Costo: $${costoServicio}`;
            servicioAgregadoDiv.appendChild(servicioTexto);

            // Botón para eliminar el servicio
            const eliminarServicioButton = document.createElement('button');
            eliminarServicioButton.textContent = "Eliminar";
            eliminarServicioButton.addEventListener('click', () => {
                eliminarServicio(servicioEncontradoIndex);
                servicioAgregadoDiv.remove();
            });
            servicioAgregadoDiv.appendChild(eliminarServicioButton);

            serviciosAgregadosDiv.appendChild(servicioAgregadoDiv);
            Swal.fire({
                icon: 'success',
                text: `Se agregó el servicio ${servicioSeleccionado} con éxito.`,
            })
        } else {
            Swal.fire({
                icon: 'error',
                text: `Lo siento mucho, el servicio mencionado no está disponible`,
            })
        }
    });
};

// Mostrar el costo total de los servicios seleccionados
const mostrarCostoTotal = () => {
    const costoTotalDiv = document.createElement('div');
    costoTotalDiv.textContent = `El costo total de los servicios seleccionados es: $${costoTotal}`;
    container.appendChild(costoTotalDiv);
    solicitarMetodoPago();
};

// Solicitar método de pago al usuario
const solicitarMetodoPago = () => {
    const metodoPagoHeader = document.createElement('p');
    metodoPagoHeader.textContent = "¿Piensa pagar con efectivo o tarjeta? (El uso de tarjeta tiene una comisión del 4%)";
    container.appendChild(metodoPagoHeader);

    const metodoPagoInput = document.createElement('input');
    metodoPagoInput.type = "text";
    metodoPagoInput.placeholder = "Ingrese su metodo de pago aqui...";
    container.appendChild(metodoPagoInput);

    const metodoPagoButton = document.createElement('button');
    metodoPagoButton.textContent = "Confirmar método de pago";
    container.appendChild(metodoPagoButton);

    metodoPagoButton.addEventListener('click', () => {
        const metodoPago = metodoPagoInput.value.toLowerCase();
        metodoPagoInput.value = "";

        if (metodoPago === "efectivo" || metodoPago === "tarjeta") {
            switch (metodoPago) {
                case "tarjeta":
                    const costoTotalConTarjeta = sumaConTarjeta(costoTotal, comision(costoTotal));
                    Swal.fire({
                        icon: 'success',
                        text:  `El costo total de los servicios seleccionados más la comisión de pago con tarjeta es: $${costoTotalConTarjeta}`,
                    })
                    break;
                case "efectivo":
                    Swal.fire({
                        icon: 'success',
                        text:  `El costo total de los servicios seleccionados es: $${costoTotal}`,
                    })
                    break;
            }
            finalizar();
        } else {
            Swal.fire({
                icon: 'error',
                text:  `Favor de ingresar si se pagará con efectivo o tarjeta.`,
            })
        }
    });
};

// Eliminar servicio
const eliminarServicio = (index) => {
    const servicioEliminado = serviciosDentales[index];
    if (servicioEliminado) {
        if (servicioEliminado.disponible) {
            servicioEliminado.disponible = false;
            costoTotal -= servicioEliminado.costo;
            localStorage.setItem('serviciosDentales', JSON.stringify(serviciosDentales));
            Swal.fire({
                icon: 'success',
                text: `Se elimino el servicio ${servicioEliminado.nombre} con éxito.`,
            })
            reiniciarLocalStorageServicio(servicioEliminado);
        } else {
            Swal.fire({
                icon: 'error',
                text: "El servicio se ha eliminado.",
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            text: "No se pudo eliminar el servicio",
        })
    }
};

// Reiniciar el localStorage del servicio eliminado
const reiniciarLocalStorageServicio = (servicio) => {
    const serviciosDentalesJSON = localStorage.getItem('serviciosDentales');
    const serviciosDentales = JSON.parse(serviciosDentalesJSON);

    // Buscar el servicio eliminado en el localStorage
    const servicioEncontradoIndex = serviciosDentales.findIndex(
        (s) => s.nombre === servicio.nombre && s.costo === servicio.costo
    );
    if (servicioEncontradoIndex !== -1) {
        serviciosDentales[servicioEncontradoIndex].disponible = true;
        localStorage.setItem('serviciosDentales', JSON.stringify(serviciosDentales));
    }
};


// Crear botón de reinicio
const reiniciarButton = document.createElement('button');
reiniciarButton.textContent = "Refrescar carrito";
const serviciosDentalesJSONreinicio = JSON.stringify(serviciosDentalesData);
localStorage.setItem('serviciosDentales', serviciosDentalesJSONreinicio);
body.appendChild(container);
body.appendChild(reiniciarButton);

// Obtener el costo total almacenado en el localStorage
const costoTotalGuardado = localStorage.getItem('costoTotal');
if (costoTotalGuardado) {
    costoTotal = parseInt(costoTotalGuardado);
}

// Función para reiniciar la página
const reiniciarPagina = () => {
    localStorage.removeItem('serviciosDentales');
    localStorage.removeItem('costoTotal');
    location.reload();
};
// Agregar evento de clic al botón de reinicio
reiniciarButton.addEventListener('click', reiniciarPagina);


// Finalizar la ejecución del programa
const finalizar = () => {
    // Almacenar el costo total en el localStorage
    localStorage.setItem('costoTotal', costoTotal.toString());

    const mensajeDespedidaDiv = document.createElement('div');
    mensajeDespedidaDiv.textContent = "Que tengas un excelente día, esperamos tu visita.";
    container.appendChild(mensajeDespedidaDiv);
};

// Iniciar proceso
solicitarServicios();