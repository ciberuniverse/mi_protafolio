def json_response(codigo: int = 200, data: dict = None) -> dict:

    http_status = {
        200: "Operación realizada con éxito.",
        201: "Recurso creado correctamente.",
        202: "Solicitud aceptada y en proceso.",
        204: "Solicitud exitosa, sin contenido que devolver.",

        301: "Recurso movido permanentemente.",
        302: "Recurso encontrado en otra ubicación temporalmente.",
        304: "No modificado desde la última solicitud.",

        400: "Solicitud incorrecta (Bad Request).",
        401: "No autorizado, requiere autenticación.",
        403: "Prohibido, acceso denegado.",
        404: "Recurso no encontrado.",
        405: "Método HTTP no permitido.",
        408: "Tiempo de espera de la solicitud agotado.",

        409: "Conflicto en la solicitud.",
        410: "Recurso eliminado permanentemente.",
        429: "Demasiadas solicitudes, límite excedido.",

        500: "Error interno del servidor.",
        501: "Funcionalidad no implementada.",
        502: "Puerta de enlace incorrecta (Bad Gateway).",
        503: "Servicio no disponible.",
        504: "Tiempo de espera de la puerta de enlace agotado."
    }

    if not data and codigo:
        data = http_status["codigo"] or "No se a logrado constatar que esta pasando."

    return {"status": codigo, "data": data}