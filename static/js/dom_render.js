
// Funcion encargada de mostrar dinamicamente el texto dependiendo del estado de los certificados
function mostrar_ocultar_id(id_document, id_solicitante) {

    const documento_m = document.getElementById(id_document)
    const documento_boton = document.getElementById(id_solicitante)

    if (documento_m.hidden) {
        documento_boton.innerHTML = "Ver Menos ..."

        documento_m.hidden = false
        return
    }

    documento_boton.innerHTML = "Ver Mas ..."
    documento_m.hidden = true
}

function verificar_data(request_json) {

    if (request_json["status"] === 200) {
        return request_json
    }

    const dom_body = document.getElementById("error")
    dom_body.setAttribute("class", "error_display")

    dom_body.innerHTML = `
        <div class="terminal">
            <div class="titulo">
                SYSTEM FAILURE CODE ${request_json["status"]}
            </div>

            <div class="descripcion">
                root:root > ${request_json["data"]} <label class="terminal_pulso_div">#</label>
            </div>
        </div>
        `

    return request_json
}

// Se envia la solicitud al endpoint para obtener la informacion del perfil en JSON
async function obtener_informacion() {
    const response = await fetch("/api/v1/profile", { "method": "get" })
    const informacion = await response.json()

    return verificar_data(informacion)
}

// Funcion monolitica encargada de renderizar la pagina web
async function renderizar_web(informacion_json) {

    // Se obtienen los id dinamicos donde se introducira cada seccion del perfil
    const main_content = document.getElementById("loaded")
    const profile_block = document.getElementById("seccion_perfil")
    const experiencias_block = document.getElementById("experiencias_block")
    const proyectos_block = document.getElementById("proyectos_block")
    const certificaciones_block = document.getElementById("certificaciones_block")

    // Se le asigna una variable a cada seccion de nuestro perfil
    const info_experiencias = informacion_json["experiencia"]
    const info_estudios = informacion_json["estudios"]
    const info_certificaciones = informacion_json["certificaciones"]
    const info_proyectos = informacion_json["proyectos"]

    // Se crea una variable que se usara de manera temporar para procesamiento del DOM
    plantilla_dom = `
            <div class="profile_rs">
                <img
                    src="https://media.licdn.com/dms/image/v2/D4E03AQH0ELpF5bMKOg/profile-displayphoto-shrink_400_400/B4EZdSaSIOHYAg-/0/1749434313221?e=1769644800&v=beta&t=pfgTNCA9ZoNAoC8pc8ruTfaLzhjiiH30qu6SnaApRrA">
                
                <div class="urls">
                <a href="https://www.linkedin.com/in/hernan-mirand4/">LinkedIn</a>
                <a href="https://github.com/ciberuniverse">GitHub</a>
                </div>
            </div>

            <div class="only_phone">
            <div class="info_profile">
                <ul>
                    <li>Nombre: </li> <label>${informacion_json["nombre"]}</label>
                    <li>Contacto: </li> <label>${informacion_json["contacto"]}</label>
                    <li>Ubicacion: </li> <label>${informacion_json["ubicacion"]}</label>
                    <li>Lema: </li> <label>Lo que no se sabe, se aprende.</label>
                </ul>
            </div>

            <div class="info_profile">
                <ul>
                    <li>Descripción: </li>
                    <label>
                        ${informacion_json["descripcion"]}
                    </label>
                </ul>
            </div>
            </div>
        `

    // Se agrega el perfil de manera dinamica al DOM
    profile_block.innerHTML = plantilla_dom

    // Variable encargada de almacenar iteraciones por informacion del DOM
    let dom_creation_tmp = ""
    for (let ex of info_experiencias) {

        plantilla_dom = `
                <div class="target_experiencia">
                <div class="titulo">${ex["ocupacion"]}</div>

                    <div class="duracion">${ex["duracion"]}</div>
                    <div class="descripcion">
                        ${ex["descripcion"]}
                    </div>
                    
                    <div class="tecnologias">
                        {{ tecnologias }}
                    </div>

                </div>

                </div>
            `

        // Se crean de manera dinamica las tecnologias dominantes
        tecnologias_ = ""
        for (let tecnologia_ of ex["tecnologias"]) {
            tecnologias_ += "> " + tecnologia_ + "\n"
        }

        // Se agrega esta iteracion a la variable temporal del DOM
        plantilla_dom = plantilla_dom.replace("{{ tecnologias }}", tecnologias_)
        dom_creation_tmp += plantilla_dom
    }

    // Se agrega la variable que contiene las secciones dinamicas nuevamente
    experiencias_block.innerHTML += dom_creation_tmp

    // Se limpia la variable
    dom_creation_tmp = ""

    // --------- Se repite por cada seccion del perfil con variaciones minimas --------
    for (let pr of info_proyectos) {
        plantilla_dom = `
                <div class="proyecto target_experiencia">
                    <div class="titulo">${pr["titulo"]}</div>
                    <div class="descripcion">${pr["descripcion"]}</div>
                    <div class="tecnologias">
                        <a class="github-button" href="${pr["url"]}" data-icon="octicon-mark-github" data-show-count="true" aria-label="">Ir al Repositorio</a>
                    </div>
                </div>
            `

        dom_creation_tmp += plantilla_dom
    }

    proyectos_block.innerHTML = dom_creation_tmp
    dom_creation_tmp = ""

    let idx = 0
    for (let ct of info_certificaciones) {

        if (idx == 3) {
            dom_creation_tmp += "<div id='ver_mas_ct' hidden>"
        }

        plantilla_dom = `
                <div class="target_experiencia" onclick='window.open("${ct["url_credencial"]}")' title="Verificar Certificado">
                    
                    <div class="titulo">${ct["titulo"]}</div>
                    <div class="duracion">${ct["organizacion"]}</div>

                    <div class="tecnologias">
                        {{ tecnologias }}
                    </div>

                </div>
            `
        tecnologias_ = ""
        for (let tecnologia_ of ct["aptitudes"]) {
            tecnologias_ += "> " + tecnologia_ + "\n"
        }

        plantilla_dom = plantilla_dom.replace("{{ tecnologias }}", tecnologias_)
        dom_creation_tmp += plantilla_dom
        idx += 1
    }

    if (idx > 3) {
        dom_creation_tmp += `</div><div class="ver_mas"><a id="ver_mas_ct_cl" onclick="mostrar_ocultar_id('ver_mas_ct', 'ver_mas_ct_cl')" title="Mostrar todas las certificaciones">Ver Mas ... </a></div>`
    }
    certificaciones_block.innerHTML += dom_creation_tmp

    return true
}

// Funcion encargada de administrar y mostrar correctamente las cosas cuando cargen completamente
async function main(params) {

    const informacion = await obtener_informacion()

    if (informacion["status"] !== 200) {
        return
    }

    const continuar = await renderizar_web(informacion["data"])

    document.getElementById("loading").style.display = "none"
    document.getElementById("loaded").hidden = false

}

main()
