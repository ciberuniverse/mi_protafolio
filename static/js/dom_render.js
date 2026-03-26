// Función para mostrar/ocultar certificados extra
function mostrar_ocultar_id(id_document, id_solicitante) {
    const elemento = document.getElementById(id_document);
    const boton = document.getElementById(id_solicitante);
    if (elemento.hidden) {
        boton.innerHTML = "Ver Menos ...";
        elemento.hidden = false;
    } else {
        boton.innerHTML = "Ver Más ...";
        elemento.hidden = true;
    }
}

// Mostrar error tipo terminal
function mostrarError(status, mensaje) {
    const body = document.body;
    body.classList.add('error_display');
    body.innerHTML = `
        <div class="terminal">
            <div class="titulo">SYSTEM FAILURE CODE ${status}</div>
            <div class="descripcion">
                root:root > ${mensaje} <span class="terminal_pulso_div">#</span>
            </div>
        </div>
    `;
}

// Obtener datos desde GitHub raw (o desde local si se cambia la ruta)
async function obtener_informacion() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/ciberuniverse/mi_protafolio/refs/heads/main/profile.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching data:", err);
        mostrarError(500, "No se pudo cargar el perfil. Verifica la conexión o la URL.");
        throw err;
    }
}

// Renderizar todo el contenido
async function renderizar_web(data) {
    // elementos contenedores
    const profileBlock = document.getElementById("seccion_perfil");
    const expBlock = document.getElementById("experiencias_block");
    const proyBlock = document.getElementById("proyectos_block");
    const certBlock = document.getElementById("certificaciones_block");

    // ----- PERFIL -----
    profileBlock.innerHTML = `
        <div class="profile_rs">
            <img src="../static/img/hernan_miranda.png" alt="Hernan Miranda">
            <div class="urls">
                <a href="https://www.linkedin.com/in/hernan-mirand4/" target="_blank" rel="noopener">LinkedIn</a>
                <a href="https://github.com/ciberuniverse" target="_blank" rel="noopener">GitHub</a>
            </div>
        </div>
        <div class="only_phone info_profile">
            <ul>
                <li>Nombre: <label>${escapeHtml(data.nombre)}</label></li>
                <li>Contacto: <label>${escapeHtml(data.contacto)}</label></li>
                <li>Titulo: <label>${escapeHtml(data.titulo)}</label></li>
                <li>Ubicación: <label>${escapeHtml(data.ubicacion)}</label></li>
                <li>Lema: <label>Lo que no se sabe, se aprende.</label></li>
            </ul>
            <ul>
                <li>Descripción: <label>${escapeHtml(data.descripcion)}</label></li>
            </ul>
        </div>
    `;

    // ----- EXPERIENCIAS -----
    let expHtml = "";
    for (const ex of data.experiencia) {
        let techs = ex.tecnologias.map(t => `> ${t}`).join("\n");
        expHtml += `
            <div class="target_experiencia">
                <div class="titulo">${escapeHtml(ex.ocupacion)}</div>
                <div class="duracion">${escapeHtml(ex.duracion)}</div>
                <div class="descripcion">${escapeHtml(ex.descripcion)}</div>
                <div class="tecnologias">${escapeHtml(techs)}</div>
            </div>
        `;
    }
    expBlock.innerHTML = expHtml;

    // ----- PROYECTOS -----
    let proyHtml = "";
    for (const pr of data.proyectos) {
        proyHtml += `
            <div class="proyecto target_experiencia">
                <div class="titulo">${escapeHtml(pr.titulo)}</div>
                <div class="descripcion">${escapeHtml(pr.descripcion)}</div>
                <div class="tecnologias">
                    <a class="" href="${pr.url}" data-icon="octicon-mark-github" data-show-count="true" aria-label="Ver repositorio">Ir al Repositorio</a>
                </div>
            </div>
        `;
    }
    proyBlock.innerHTML = proyHtml;

    // ----- CERTIFICACIONES (con toggle "Ver más") -----
    let certHtml = "";
    let idx = 0;
    const certs = data.certificaciones;
    const threshold = 3;

    for (let i = 0; i < certs.length; i++) {
        const ct = certs[i];
        if (i === threshold) {
            certHtml += `<div id="ver_mas_ct" hidden>`;
        }
        let apts = ct.aptitudes.map(a => `> ${a}`).join("\n");
        certHtml += `
            <div class="target_experiencia" onclick='window.open("${ct.url_credencial}")' title="Verificar certificado">
                <div class="titulo">${escapeHtml(ct.titulo)}</div>
                <div class="duracion">${escapeHtml(ct.organizacion)}</div>
                <div class="tecnologias">${escapeHtml(apts)}</div>
            </div>
        `;
    }
    if (certs.length > threshold) {
        certHtml += `</div><div class="ver_mas"><a id="ver_mas_ct_cl" onclick="mostrar_ocultar_id('ver_mas_ct', 'ver_mas_ct_cl')">Ver Más ...</a></div>`;
    }
    certBlock.innerHTML = certHtml;
}

// utilidad para escapar HTML (seguridad)
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

// MAIN
(async function main() {
    try {
        const data = await obtener_informacion();
        await renderizar_web(data);
        // ocultar loading y mostrar contenido
        document.getElementById("loading").style.display = "none";
        document.getElementById("loaded").hidden = false;
    } catch (err) {
        console.error("Error en la carga:", err);
        // el error ya se mostró con mostrarError()
    }
})();