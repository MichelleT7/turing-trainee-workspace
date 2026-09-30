/**
 * Automatización de Tareas Laborales - Turing
 *
 * Flujo:
 * 1. Lee las tareas de Google Sheets.
 * 2. Detecta tareas pendientes.
 * 3. Calcula los días restantes.
 * 4. Actualiza Google Sheets.
 * 5. Envía una notificación mediante Gmail.
 * 6. Crea automáticamente un evento en Google Calendar.
 * 7. Registra el resultado del evento en la hoja.
 */

function procesarTareas() {

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const datos = hoja.getDataRange().getValues();

  // Recorremos las filas después de los encabezados.
  for (let i = 1; i < datos.length; i++) {

    const id = datos[i][0];
    const tarea = datos[i][1];
    const responsable = datos[i][2];
    const correo = datos[i][3];
    const fechaLimite = datos[i][4];
    const prioridad = datos[i][5];
    const estado = String(datos[i][6]).trim();

    // Solo procesamos tareas pendientes.
    if (estado === "Pendiente" && fechaLimite && correo) {

      try {

        // Convertimos la fecha límite a objeto Date.
        const fecha = new Date(fechaLimite);

        // Fecha actual.
        const hoy = new Date();

        hoy.setHours(0, 0, 0, 0);
        fecha.setHours(0, 0, 0, 0);

        // Calculamos los días restantes.
        const diferencia = fecha.getTime() - hoy.getTime();

        const diasRestantes = Math.ceil(
          diferencia / (1000 * 60 * 60 * 24)
        );

        // Actualizamos los días restantes en la columna H.
        hoja.getRange(i + 1, 8).setValue(diasRestantes);

        // Enviamos la notificación por Gmail.
        enviarNotificacion(
          correo,
          responsable,
          tarea,
          fecha,
          prioridad,
          diasRestantes
        );

        // Creamos el evento en Google Calendar.
        const evento = crearEventoCalendar(
          tarea,
          responsable,
          fecha,
          prioridad,
          diasRestantes
        );

        // Guardamos el identificador del evento en la hoja.
        hoja.getRange(i + 1, 9).setValue(evento.getId());

        // Marcamos la tarea como procesada.
        hoja.getRange(i + 1, 7).setValue("Procesada");

        Logger.log(
          "Tarea procesada correctamente: " +
          id +
          " | " +
          tarea +
          " | Evento Calendar creado"
        );

      } catch (error) {

        // Registramos cualquier error ocurrido durante el proceso.
        Logger.log(
          "Error al procesar la tarea " +
          id +
          ": " +
          error.message
        );
      }
    }
  }
}


/**
 * Envía una notificación al responsable mediante Gmail.
 */
function enviarNotificacion(
  correo,
  responsable,
  tarea,
  fechaLimite,
  prioridad,
  diasRestantes
) {

  const asunto = "Nueva tarea laboral asignada: " + tarea;

  const cuerpo =
    "Hola " + responsable + ",\n\n" +
    "Se te ha asignado una nueva tarea laboral.\n\n" +
    "Tarea: " + tarea + "\n" +
    "Prioridad: " + prioridad + "\n" +
    "Fecha límite: " +
    Utilities.formatDate(
      fechaLimite,
      Session.getScriptTimeZone(),
      "dd/MM/yyyy"
    ) +
    "\n" +
    "Días restantes: " + diasRestantes + "\n\n" +
    "Este correo fue generado automáticamente mediante Google Apps Script.\n\n" +
    "Saludos.";

  GmailApp.sendEmail(
    correo,
    asunto,
    cuerpo
  );
}


/**
 * Crea un evento de día completo en Google Calendar.
 */
function crearEventoCalendar(
  tarea,
  responsable,
  fechaLimite,
  prioridad,
  diasRestantes
) {

  // Utilizamos el calendario principal de la cuenta.
  const calendario = CalendarApp.getDefaultCalendar();

  const titulo = "Tarea: " + tarea;

  const descripcion =
    "Tarea laboral asignada automáticamente.\n\n" +
    "Responsable: " + responsable + "\n" +
    "Prioridad: " + prioridad + "\n" +
    "Días restantes: " + diasRestantes + "\n\n" +
    "Evento creado automáticamente mediante Google Apps Script.";

  // Crea un evento de día completo en la fecha límite.
  const evento = calendario.createAllDayEvent(
    titulo,
    fechaLimite,
    {
      description: descripcion
    }
  );

  return evento;
}
