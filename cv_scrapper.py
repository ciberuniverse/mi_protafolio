import datetime, requests, json

class Informacion:

    def __init__(self, documento_pdf_json: bytes | dict):

        self.ultima_fecha = self.obtener_fecha()
        self.fecha_actual = self.obtener_fecha()
        self.informacion = self.__actualizar__informacion__(documento_pdf_json=documento_pdf_json)

        self.host_info = ""
        
    @staticmethod
    def obtener_fecha() -> str:
        return datetime.datetime.now().strftime("%d-%m-%Y")
    
    @staticmethod
    def __actualizar__informacion__(documento_pdf_json: bytes | dict) -> dict:
        
        if type(documento_pdf_json) == dict:
            return documento_pdf_json
    
    def actualizar_pagina(self) -> None:
        try:
            info = requests.get(self.host_info)
            info = json.loads(info.text)

            self.informacion = info
        
        except Exception as err:
            print(f"ERROR SOLUCIONAR EN BACKEND: {err}")

    def __str__(self):

        if self.fecha_actual == self.ultima_fecha:
            return self.informacion
        
        ######### Se actualiza la informacion en caso de tener fechas diferentes
        self.actualizar_pagina()

        return str(self.informacion)
    
perfil_ = Informacion()

print(perfil_.fecha_actual, perfil_)