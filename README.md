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

## Tecnologías utilizadas

- Google Sheets
- Google Apps Script
- JavaScript
- Gmail
- Google Calendar
- Triggers de Google Apps Script

## Flujo de trabajo

El flujo implementado es el siguiente:

```text
Google Sheets
     |
     v
Google Apps Script
     |
     v
Detectar tarea pendiente
     |
     v
Calcular días restantes
     |
     v
Actualizar Google Sheets
     |
     +--------------------+
     |                    |
     v                    v
   Gmail             Google Calendar
     |                    |
     v                    v
Notificación         Crear evento







