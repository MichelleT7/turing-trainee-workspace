# Automatización de Tareas Laborales - Turing IA

## Descripción

Proyecto desarrollado como parte de la actividad del Día 2: Automatización y Personalización en Google Workspace.

El proyecto implementa una automatización de tareas laborales utilizando Google Apps Script e integrando diferentes servicios de Google Workspace.

## Objetivo

Automatizar el procesamiento de tareas laborales registradas en Google Sheets, permitiendo:

- Detectar tareas pendientes.
- Calcular los días restantes hasta la fecha límite.
- Actualizar la información de la tarea en Google Sheets.
- Enviar una notificación por correo electrónico mediante Gmail.
- Crear automáticamente un evento en Google Calendar.
- Ejecutar el proceso automáticamente mediante un activador basado en tiempo (Time-based Trigger).

  ## Configuración del proyecto

### 1. Creación de Google Sheets

Se creó una hoja de cálculo para registrar y administrar las tareas laborales.

La estructura utilizada fue:

| Campo | Descripción |
|---|---|
| ID | Identificador de la tarea |
| Tarea | Nombre o descripción de la tarea |
| Responsable | Persona responsable |
| Correo | Correo electrónico del responsable |
| Fecha límite | Fecha establecida para completar la tarea |
| Prioridad | Prioridad de la tarea |
| Estado | Estado actual de la tarea |
| Días restantes | Días disponibles antes de la fecha límite |
| Evento Calendar | Identificador del evento creado en Google Calendar |

### 2. Creación de Google Apps Script

Se creó un proyecto de Google Apps Script vinculado a Google Sheets.

El script utiliza JavaScript para leer los registros de la hoja, procesar las tareas pendientes y actualizar automáticamente la información.

### 3. Procesamiento de tareas

La función principal `procesarTareas()` realiza las siguientes acciones:

1. Obtiene la hoja activa.
2. Lee los registros de tareas.
3. Identifica las tareas pendientes.
4. Calcula los días restantes.
5. Actualiza la hoja de cálculo.
6. Envía una notificación mediante Gmail.
7. Crea un evento en Google Calendar.
8. Registra el identificador del evento para evitar duplicados.


## Automatización mediante Trigger

Para ejecutar el proceso automáticamente se configuró un activador basado en tiempo (Time-based Trigger).

El activador ejecuta la función:

`procesarTareas`

Esto permite que el procesamiento de las tareas se realice automáticamente sin necesidad de ejecutar manualmente el script.

La configuración fue verificada desde la sección de Triggers de Google Apps Script.


## Tecnologías utilizadas

- Google Sheets
- Google Apps Script
- JavaScript
- Gmail
- Google Calendar
- Triggers de Google Apps Script

## Decisiones técnicas

Se utilizó Google Apps Script debido a su integración directa con Google Workspace.

La automatización utiliza Google Sheets como fuente de información y conecta Gmail y Google Calendar para generar acciones automáticamente.

El procesamiento se realiza únicamente sobre tareas pendientes y se registra el identificador del evento de Calendar en la hoja para mantener control sobre los eventos generados.

El código contiene comentarios para explicar las principales decisiones y etapas del procesamiento.

## Conclusión

Se desarrolló una automatización de tareas laborales utilizando Google Apps Script e integrando Google Sheets, Gmail y Google Calendar.

La solución permite procesar automáticamente las tareas pendientes, calcular los días restantes, actualizar la información registrada, enviar notificaciones por correo electrónico y crear eventos en Calendar.

También se configuró un activador basado en tiempo para ejecutar el proceso automáticamente.

Las pruebas realizadas permitieron verificar el funcionamiento de cada componente y la integración entre los diferentes servicios de Google Workspace.


## Diagrama de arquitectura

El sistema está compuesto por un bucket de Google Cloud Storage, una función
de procesamiento de archivos, una cuenta de servicio con permisos mínimos y
Cloud Logging para el registro y monitoreo de eventos.

```mermaid
flowchart LR

    U[Usuario]
    
    B[(Google Cloud Storage<br/>turing-trainee-gcp-files-2026)]
    
    E[Evento de subida<br/>de archivo]
    
    F[Cloud Function / Cloud Run<br/>turing-gcp-file-metadata]
    
    SA[Service Account<br/>turing-gcp-file-metadata-sa]
    
    L[Cloud Logging]
    
    P[Validación y extracción<br/>de metadatos]
    
    U -->|Sube archivo| B
    B -->|Dispara evento| E
    E --> F
    
    F --> P
    
    F -.->|Identidad y permisos| SA
    
    P -->|Registra información| L
    
    P -->|Nombre, tamaño,<br/>tipo y extensión| L






### 2. ¿Cómo se verá conceptualmente?

El flujo que estás documentando sería:

```text
                    ┌─────────────────┐
                    │     Usuario     │
                    └────────┬────────┘
                             │
                       Sube archivo
                             │
                             ▼
              ┌───────────────────────────┐
              │      Cloud Storage        │
              │                           │
              │ turing-trainee-gcp-       │
              │ files-2026                │
              └─────────────┬─────────────┘
                            │
                       Evento de carga
                            │
                            ▼
              ┌───────────────────────────┐
              │      Cloud Function       │
              │ turing-gcp-file-metadata  │
              │                           │
              │     process_file()        │
              └─────────────┬─────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
                    ▼                ▼
             ┌─────────────┐  ┌───────────────┐
             │ Validación  │  │   Cloud       │
             │ de archivo  │  │   Logging     │
             └─────────────┘  └───────────────┘
                    │
                    ▼
             ┌─────────────────┐
             │ Metadatos       │
             │ • Nombre        │
             │ • Tamaño        │
             │ • Tipo MIME     │
             │ • Extensión     │
             └─────────────────┘

                     ▲
                     │
             ┌───────┴────────┐
             │ Service Account │
             │ metadata-sa     │
             │                 │
             │ Storage Object  │
             │ Viewer          │
             └─────────────────┘






