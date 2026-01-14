import datetime, requests, json, time

class Informacion:

    def __init__(self):

        self.host_info = "https://raw.githubusercontent.com/ciberuniverse/mi_protafolio/refs/heads/main/profile.json"

        self.ultima_fecha = self.obtener_fecha()
        self.fecha_actual = self.obtener_fecha()
        self.informacion = self.actualizar_pagina()
        
    @staticmethod
    def obtener_fecha() -> str:
        return datetime.datetime.now().strftime("%d-%m-%Y")
        
    def actualizar_pagina(self) -> None:
        try:
            info = requests.get(self.host_info)
            info = json.loads(info.text)

            return info
        
        except Exception as err:
            print(f"ERROR SOLUCIONAR EN BACKEND: {err}")

    def retornar_api(self) -> dict:
        if self.fecha_actual == self.ultima_fecha:
            return self.informacion
        
        ######### Se actualiza la informacion en caso de tener fechas diferentes
        self.actualizar_pagina()

        return self.informacion
    
    def __str__(self):
        return """fast-api version 1.2.3"""
        

    
perfil_ = Informacion()
