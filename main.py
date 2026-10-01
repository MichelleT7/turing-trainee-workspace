import functions_framework
import logging
import os


# Configuración de seguridad y validación
ALLOWED_EXTENSIONS = {
    ".txt",
    ".pdf",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

EXPECTED_BUCKET = "turing-trainee-gcp-files-2026"


@functions_framework.cloud_event
def process_file(cloud_event):
    try:
        data = cloud_event.data

        # Validar que exista información del evento
        if not data:
            raise ValueError("El evento no contiene datos.")

        bucket = data.get("bucket")
        name = data.get("name")
        size = data.get("size")
        content_type = data.get("contentType")

        # Validar bucket
        if bucket != EXPECTED_BUCKET:
            raise ValueError(
                f"Bucket no autorizado: {bucket}"
            )

        # Validar nombre del archivo
        if not name or not isinstance(name, str):
            raise ValueError("El nombre del archivo es inválido.")

        # Evitar nombres sospechosos
        if ".." in name or name.startswith("/"):
            raise ValueError(
                f"Nombre de archivo no permitido: {name}"
            )

        # Validar tamaño
        if size is None:
            raise ValueError("El tamaño del archivo no fue proporcionado.")

        try:
            size = int(size)
        except (TypeError, ValueError):
            raise ValueError(
                f"El tamaño del archivo no es válido: {size}"
            )

        if size <= 0:
            raise ValueError(
                f"El archivo está vacío o tiene un tamaño inválido: {size} bytes"
            )

        if size > MAX_FILE_SIZE:
            raise ValueError(
                f"El archivo supera el límite permitido de "
                f"{MAX_FILE_SIZE} bytes."
            )

        # Validar tipo MIME
        if not content_type or not isinstance(content_type, str):
            raise ValueError(
                "El tipo de contenido del archivo es inválido."
            )

        # Validar extensión
        extension = os.path.splitext(name)[1].lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise ValueError(
                f"Extensión no permitida: {extension}"
            )

        # Registro de información validada
        logging.info("Archivo recibido y validado correctamente")
        logging.info(f"Bucket: {bucket}")
        logging.info(f"Nombre: {name}")
        logging.info(f"Tamaño: {size} bytes")
        logging.info(f"Tipo: {content_type}")
        logging.info(f"Extensión: {extension}")

        print(f"Archivo validado: {name}")
        print(f"Tamaño: {size} bytes")
        print(f"Tipo: {content_type}")

    except Exception as e:
        logging.exception(
            f"Error durante la validación del archivo: {e}"
        )
        raise
