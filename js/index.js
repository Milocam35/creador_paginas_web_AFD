// Definición de transiciones del autómata para completar el HTML generado por el usuario
const transitions = {
    'q0': {
        '<!DOCTYPE html>': 'q1'
    },
    'q1': {
        '<html>': 'q2'
    },
    'q2': {
        '<head>': 'q3'
    },
    'q3': {
        '<title>': 'q4',
        '<meta charset="UTF-8">': 'q5',
        '<style>': 'q7'
    },
    'q4': {
        '</title>': 'q3'
    },
    'q5': {
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">': 'q6'
    },
    'q6': {
        '</head>': 'q8'
    },
    'q7': {
        '</style>': 'q6'
    },
    'q8': {
        '<body>': 'q9'
    },
    'q9': {
        '<h1>': 'q11',
        '<h3>': 'q11',
        '<h4>': 'q11',
        '<h6>': 'q11',
        '<p>': 'q12',
        '<img>': 'q13',
        '<video>': 'q14',
        '<a>': 'q15',
        '<ol>': 'q16',
        '<ul>': 'q17',
        '<div>': 'q10',
        '</body>': 'q18'
    },
    'q10': {
        '<h1>': 'q11',
        '<p>': 'q12',
        '<img>': 'q13',
        '<video>': 'q14',
        '<a>': 'q15',
        '<ol>': 'q16',
        '<ul>': 'q17',
        '<div>': 'q10',
        '</div>': 'q9'
    },
    'q11': {
        '</h1>': 'q9',
    },
    'q12': {
        '<br>': 'q12',
        '</p>': 'q9'
    },
    'q13': {
        '': 'q9'
    },
    'q14': {
        '</video>': 'q9'
    },
    'q15': {
        '</a>': 'q9'
    },
    'q16': {
        '<li>': 'q19',
        '</ol>': 'q9'
    },
    'q17': {
        '<li>': 'q19',
        '</ul>': 'q9'
    },
    'q18': {
        '</html>': 'q0'
    },
    'q19': {
        '</li>': 'q16',
        '</li>': 'q17'
    }
};

// Definición de los estados y estados de aceptación
const states = [
    'q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
    'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19'
];
const initialState = 'q0';

let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{background-color: white; margin: 0; padding: 0;}</style></head><body></body></html>';

// Contenido HTML inicial para el iframe
const initialIframeContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background-color: white;
            color: black;
            margin: 0;
            padding: 0;
        }
    </style>
    <title>Preview</title>
</head>
<body>
</body>
</html>
`;

let currentElement; // Variable para almacenar el elemento actual que se está editando

// Función para inicializar el contenido del iframe
function initializeIframe() {
    const iframe = document.getElementById('preview-iframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(initialIframeContent);
    iframeDocument.close();
}

// Función para resaltar el elemento seleccionado
function highlightElement(element) {
    const iframe = document.getElementById('preview-iframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const allElements = iframeDocument.querySelectorAll('*');
    allElements.forEach(el => el.style.outline = 'none');
    element.style.outline = '2px solid red';
}

function rgbToHex(rgb) {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    return result ? "#" +
        ("0" + parseInt(result[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[3], 10).toString(16)).slice(-2) : rgb;
}

// Función para permitir la edición del elemento seleccionado
function handleEdit() {
    if (!currentElement) return;

    const tagName = currentElement.tagName.toLowerCase();
    const attributes = currentElement.attributes;
    const styles = currentElement.style;
    const innerText = currentElement.innerText;

    let values = {};

    switch (tagName) {
        case 'h1':
            values = {
                textoTitulos: innerText,
                tamañoTitulos: parseInt(styles.fontSize),
                colorTitulos: rgbToHex(styles.color),
                negrillaTitulos: styles.fontWeight === 'bold'
            };
            break;
        case 'p':
            values = {
                textoParrafos: innerText.replace(/<br>/g, '\n'),
                tamañoParrafos: parseInt(styles.fontSize),
                colorParrafos: rgbToHex(styles.color),
                negrillaParrafos: styles.fontWeight === 'bold'
            };
            break;
        case 'a':
            values = {
                textoLinks: innerText,
                link: attributes.href.value,
                tamañoLinks: parseInt(styles.fontSize),
                colorLinks: rgbToHex(styles.color),
                negrillaLinks: styles.fontWeight === 'bold',
                subrayadoLinks: styles.textDecoration === 'underline'
            };
            break;
        case 'img':
            values = {
                largoImagen: parseInt(styles.height),
                anchoImagen: parseInt(styles.width),
                bordeImagen: styles.border !== 'none',
                radioImagen: parseInt(styles.borderRadius)
            };
            break;
        case 'video':
            values = {
                anchoVideo: parseInt(styles.width),
                largoVideo: parseInt(styles.height),
                bordeVideo: styles.border !== 'none',
                radioVideo: parseInt(styles.borderRadius),
                loopVideo: attributes.loop !== undefined,
                playVideo: attributes.autoplay !== undefined
            };
            break;
        // Agregar más casos según los elementos que estés usando
        default:
            break;
    }

    populateForm(tagName, values);
}

function populateForm(tagName, values) {
    let subnavbarId;

    switch (tagName) {
        case 'h1':
            subnavbarId = 'subnavbar-h1';
            break;
        case 'p':
            subnavbarId = 'subnavbar-p';
            break;
        case 'a':
            subnavbarId = 'subnavbar-a';
            break;
        case 'img':
            subnavbarId = 'subnavbar-img';
            break;
        case 'video':
            subnavbarId = 'subnavbar-video';
            break;
        // Agregar más casos según los elementos que estés usando
        default:
            return;
    }

    const subnavbar = document.getElementById(subnavbarId);
    const inputs = subnavbar.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        if (values.hasOwnProperty(input.id)) {
            if (input.type === 'checkbox') {
                input.checked = values[input.id];
            } else {
                input.value = values[input.id];
            }
        }
    });
}

function applyChanges() {
    if (!currentElement) return;

    const tagName = currentElement.tagName.toLowerCase();
    const section = document.querySelector(`#subnavbar-${tagName}`);

    // Verificar que se encontró la sección correspondiente
    if (!section) {
        console.error(`No se encontró la sección para el tag: ${tagName}`);
        return;
    }

    switch (tagName) {
        case 'h1':
            const textoTitulos = section.querySelector('#textoTitulos').value;
            const tamañoTitulos = section.querySelector('#tamañoTitulos').value;
            const colorTitulos = section.querySelector('#colorTitulos').value;
            const negrillaTitulos = section.querySelector('#negrillaTitulos').checked;
            
            currentElement.innerText = textoTitulos;
            currentElement.style.fontSize = `${tamañoTitulos}px`;
            currentElement.style.color = colorTitulos;
            currentElement.style.fontWeight = negrillaTitulos ? 'bold' : 'normal';
            break;
        case 'p':
            const textoParrafos = section.querySelector('#textoParrafos').value;
            const tamañoParrafos = section.querySelector('#tamañoParrafos').value;
            const colorParrafos = section.querySelector('#colorParrafos').value;
            const negrillaParrafos = section.querySelector('#negrillaParrafos').checked;
            
            currentElement.innerHTML = textoParrafos.replace(/\n/g, '<br>');
            currentElement.style.fontSize = `${tamañoParrafos}px`;
            currentElement.style.color = colorParrafos;
            currentElement.style.fontWeight = negrillaParrafos ? 'bold' : 'normal';
            break;
        case 'a':
            const textoLinks = section.querySelector('#textoLinks').value;
            const link = section.querySelector('#link').value;
            const tamañoLinks = section.querySelector('#tamañoLinks').value;
            const colorLinks = section.querySelector('#colorLinks').value;
            const negrillaLinks = section.querySelector('#negrillaLinks').checked;
            const subrayadoLinks = section.querySelector('#subrayadoLinks').checked;
            
            currentElement.innerText = textoLinks;
            currentElement.href = link;
            currentElement.style.fontSize = `${tamañoLinks}px`;
            currentElement.style.color = colorLinks;
            currentElement.style.fontWeight = negrillaLinks ? 'bold' : 'normal';
            currentElement.style.textDecoration = subrayadoLinks ? 'underline' : 'none';
            break;
        case 'img':
            const largoImagen = section.querySelector('#largoImagen').value;
            const anchoImagen = section.querySelector('#anchoImagen').value;
            const bordeImagen = section.querySelector('#bordeImagen').checked;
            const radioImagen = section.querySelector('#radioImagen').value;
            
            currentElement.style.height = `${largoImagen}px`;
            currentElement.style.width = `${anchoImagen}px`;
            currentElement.style.border = bordeImagen ? '1px solid black' : 'none';
            currentElement.style.borderRadius = `${radioImagen}px`;
            break;
        case 'video':
            const anchoVideo = section.querySelector('#anchoVideo').value;
            const largoVideo = section.querySelector('#largoVideo').value;
            const bordeVideo = section.querySelector('#bordeVideo').checked;
            const radioVideo = section.querySelector('#radioVideo').value;
            const loopVideo = section.querySelector('#loopVideo').checked;
            const playVideo = section.querySelector('#playVideo').checked;
            
            currentElement.style.width = `${anchoVideo}px`;
            currentElement.style.height = `${largoVideo}px`;
            currentElement.style.border = bordeVideo ? '1px solid black' : 'none';
            currentElement.style.borderRadius = `${radioVideo}px`;
            currentElement.loop = loopVideo;
            currentElement.autoplay = playVideo;
            break;
        // Agregar más casos según los elementos que estés usando
        default:
            console.error(`No hay soporte para el tag: ${tagName}`);
            break;
    }
}



// Función para eliminar el elemento seleccionado
function handleDelete() {
    if (!currentElement) return;
    currentElement.remove();
    currentElement = null;
    html = document.getElementById('preview-iframe').contentDocument.documentElement.outerHTML;
}

// Llama a la función para inicializar el iframe cuando la página se haya cargado
document.addEventListener('DOMContentLoaded', initializeIframe);

let elementStack = []; // Pila para guardar las etiquetas ingresadas

// Función para encontrar la posición donde insertar la nueva etiqueta
function findInsertPosition(html, state) {
    let currentState = initialState;
    let insertPosition = -1;

    const tagRegex = /<\/?[^>]+>/g;
    let match;

    while ((match = tagRegex.exec(html)) !== null) {
        const tag = match[0];
        if (transitions[currentState] && transitions[currentState][tag]) {
            currentState = transitions[currentState][tag];
            if (currentState === state) {
                insertPosition = match.index + tag.length;
            }
        }
    }
    return insertPosition;
}

// Función para actualizar el contenido del iframe
function updateIframeContent(html) {
    const iframe = document.getElementById('preview-iframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(html);
    iframeDocument.close();
}

// Función para permitir subir imágenes al usuario
let base64Image = '';
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            base64Image = reader.result;
        };
        reader.readAsDataURL(file);
    }
}

// Función para editar el header del iframe
function insertOrReplaceStyleTag(html, tag) {
    const styleTagRegex = /<title>([\s\S]*?)<\/title><style>([\s\S]*?)<\/style>/;
    if (styleTagRegex.test(html)) {
        return html.replace(styleTagRegex, tag);
    } else {
        const headEndTag = '</head>';
        const insertPosition = html.indexOf(headEndTag);
        if (insertPosition !== -1) {
            html = html.slice(0, insertPosition) + tag + html.slice(insertPosition);
        }
        return html;
    }
}

// Función para insertar la etiqueta generada en la posición correcta del string html
function insertTag(html, tag, state, isStyleTag = false) {
    if (isStyleTag) {
        return insertOrReplaceStyleTag(html, tag);
    } else {
        // Si hay elementos en la pila, encontrar la posición después del último elemento
        if (elementStack.length > 0) {
            const lastElement = elementStack[elementStack.length - 1];
            const lastElementPosition = html.lastIndexOf(lastElement);
            if (lastElementPosition !== -1) {
                const insertPosition = lastElementPosition + lastElement.length;
                html = html.slice(0, insertPosition) + tag + html.slice(insertPosition);
                elementStack.push(tag); // Agregar la nueva etiqueta a la pila
                return html;
            }
        }

        // Si la pila está vacía o no se encuentra la posición, usar findInsertPosition
        const position = findInsertPosition(html, state);
        if (position !== -1) {
            html = html.slice(0, position) + tag + html.slice(position);
        } else {
            const bodyEndTag = '</body>';
            const insertPosition = html.lastIndexOf(bodyEndTag);
            if (insertPosition !== -1) {
                html = html.slice(0, insertPosition) + tag + html.slice(insertPosition);
            }
        }
        elementStack.push(tag); // Agregar la nueva etiqueta a la pila
        return html;
    }
}

// Función principal de creación de etiquetas, recibe el input del usuario y lo transforma en la etiqueta elegida
// Modificar handleCreate para actualizar el elemento actual si está en edición
function handleCreate(subnavbarId) {
    const subnavbar = document.getElementById(subnavbarId);
    const inputs = subnavbar.querySelectorAll('input, textarea, select');
    const values = {};

    inputs.forEach(input => {
        values[input.id] = input.type === 'checkbox' ? input.checked : input.value;
    });

    const generatedTag = generateTag(subnavbarId, values);
    console.log(generatedTag);

    let targetState;
    let isStyleTag = false;
    switch (subnavbarId) {
        case 'subnavbar-h1':
        case 'subnavbar-p':
        case 'subnavbar-a':
        case 'subnavbar-img':
        case 'subnavbar-video':
            targetState = 'q9';
            break;
        case 'subnavbar0':
            targetState = 'q3';
            isStyleTag = true;
            break;
        default:
            targetState = 'q9';
            break;
    }

    if (currentElement) {
        currentElement.outerHTML = generatedTag;
        currentElement = null;
    } else {
        html = insertTag(html, generatedTag, targetState, isStyleTag);
    }

    updateIframeContent(html);
}

// Función para generar la etiqueta correspondiente basada en los valores del usuario
function generateTag(subnavbarId, values) {
    let tag = '';
    let defaultStyles = {
        'tamañoTitulos': '24',
        'colorTitulos': '#000000',
        'negrillaTitulos': false,
        'tamañoParrafos': '16',
        'colorParrafos': '#000000',
        'negrillaParrafos': false,
        'tamañoLinks': '16',
        'link': 'https://www.w3schools.com',
        'colorLinks': '#0000EE',
        'negrillaLinks': false,
        'subrayadoLinks': true,
        'srcImagen': 'https://images7.alphacoders.com/115/1158141.jpg',
        'largoImagen': '200',
        'anchoImagen': '300',
        'bordeImagen': false,
        'radioImagen': '0',
        'colorBody': 'white',
        'alignBody': 'left',
        'srcVideo': '',
        'anchoVideo': '300',
        'largoVideo': '200',
        'bordeVideo': false,
        'radioVideo': '0',
        'loopVideo': false,
        'playVideo': false,
    };

    switch (subnavbarId) {
        case 'subnavbar-h1': // Títulos
            let titleStyle = `
                font-size: ${values.tamañoTitulos || defaultStyles.tamañoTitulos}px;
                color: ${values.colorTitulos || defaultStyles.colorTitulos};
                font-weight: ${values.negrillaTitulos ? 'bold' : 'normal'};
            `;
            tag = `<h1 style="${titleStyle}">${values.textoTitulos || 'Título'}</h1>`;
            break;
        case 'subnavbar-p': // Párrafos
            let paragraphStyle = `
                font-size: ${values.tamañoParrafos || defaultStyles.tamañoParrafos}px;
                color: ${values.colorParrafos || defaultStyles.colorParrafos};
                font-weight: ${values.negrillaParrafos ? 'bold' : 'normal'};
            `;
            console.log(values.textoParrafos);
            let textoParrafos = (values.textoParrafos || 'Texto del párrafo').replace(/\n/g, '<br>');
            tag = `<p style="${paragraphStyle}">${textoParrafos}</p>`;
            break;
        case 'subnavbar-a': // Links
            let linkStyle = `
                font-size: ${values.tamañoLinks || defaultStyles.tamañoLinks}px;
                color: ${values.colorLinks || defaultStyles.colorLinks};
                font-weight: ${values.negrillaLinks ? 'bold' : 'normal'};
                text-decoration: ${values.subrayadoLinks ? 'underline' : 'none'};
            `;
            tag = `<a href="${values.link || defaultStyles.link}" style="${linkStyle}">${values.textoLinks || 'Texto del enlace'}</a>`;
            break;
        case 'subnavbar-img': // Imágenes
            let imgStyle = `
                width: ${values.anchoImagen || defaultStyles.anchoImagen}px;
                height: ${values.largoImagen || defaultStyles.largoImagen}px;
                border: ${values.bordeImagen ? '1px solid #000000' : 'none'};
                border-radius: ${values.radioImagen || defaultStyles.radioImagen}px;
                display: block;
            `;
            tag = `<img src="${base64Image || defaultStyles.srcImagen}" style="${imgStyle}">`;
            break;
        case 'subnavbar-video': //Videos
            let videoStyle = `
            width: ${values.anchoVideo || defaultStyles.anchoVideo}px;
            height: ${values.largoVideo || defaultStyles.largoVideo}px;
            border: ${values.bordeVideo ? '1px solid #000000' : 'none'};
            border-radius: ${values.radioVideo || defaultStyles.radioVideo}px;
            display: block;
            `;
            tag = `<video src="${base64Image || defaultStyles.srcVideo}" style="${videoStyle}" controls ${values.loopVideo ? 'loop': ''} ${values.playVideo ?'autoplay': ''}></video>`;
            break;
        case 'subnavbar0': // Body
            let alignValue = values.alignBody || defaultStyles.alignBody;
            let bodyStyle = `
                background-color: ${values.colorBody || defaultStyles.colorBody};
                font-family: ${values.fuenteBody || ''};
                line-height: ${values.alturaBody || ''};
                display: flex;
                flex-direction: column;
                justify-content: ${alignValue};
                align-items: ${alignValue};
            `;
            tag = `<title>${values.tituloPagina}</title><style>body { ${bodyStyle} }</style>`;
            break;
        default:
            tag = '<!-- No valid subnavbarId -->';
            break;
    }
    return tag;
}




//Crear un navItem para el navBar o subNavbar
function createNavItem(id, iconClass, text, backButton) {
    return `
        <li class="nav-item ${backButton}" id="${id}">
            <a class="nav-link">
                <i class="${iconClass}"></i>
                <span class="link-text">${text}</span>
            </a>
        </li>
    `;
}

//Funcion para crear las etiquetas inputs en los subnavbars de la pagina
function createNavInput(id, inputClass, text, type, inputId) {
    if (type === 'textarea') {
        return `
            <li class="nav-item" id="${id}">
                <a class="nav-link">
                    <span style="margin-left: 1rem;">${text}</span>
                    <textarea class="${inputClass}" id="${inputId}"></textarea>
                </a>
            </li>
        `;
    }else if(inputId === 'srcImagen'){
        return `
            <li class="nav-item" id="${id}">
                <a class="nav-link">
                    <span style="margin-left: 1rem;">${text}</span>
                    <input class="${inputClass}" type="${type}" id="${inputId}" accept="image/png, image/jpeg">
                </a>
            </li>
        `;
    }else if(type === 'select'){
        return `
        <li class="nav-item" id="${id}">
                <a class="nav-link">
                    <span style="margin-left: 1rem;">${text}</span>
                    <select id ="${inputId}">
                        <option value="flex-start">Izquierda</option>
                        <option value="center">Centrado</option>
                        <option value="flex-end">Derecha</option>
                    </select>
                </a>
            </li>
        `;
    }else {
        return `
            <li class="nav-item" id="${id}">
                <a class="nav-link">
                    <span style="margin-left: 1rem;">${text}</span>
                    <input class="${inputClass}" type="${type}" id="${inputId}">
                </a>
            </li>
        `;
    }
}

//Crear el boton para crear la etiqueta seleccionada por el usuario
function createNavButton(buttonClass, buttonId, buttonText, buttonFunc) {
    return `
        <li class="nav-item">
            <a class="nav-link">
                <input class="${buttonClass}" type="button" onclick="${buttonFunc}" value="${buttonText}" id="${buttonId}">
            </a>
        </li>
    `;
}

//Crea el menu principal de la pagina
function createNavbar() {
    return `
        <nav class="navbar" id="navBar">
            <ul class="navbar-nav" id="navbar-container">
                ${createNavItem('logo', 'fa-solid fa-house', 'WEBDEV')}
                ${createNavItem('opcionCuerpo', 'fa-solid fa-window-maximize', 'Cuerpo')}
                ${createNavItem('opcionMedia', 'fa-solid fa-image', 'Media')}
                ${createNavItem('opcionText', 'fa-solid fa-font', 'Texts')}
            </ul>
        </nav>
    `;
}

//Crea los subnavbars para las selecciones de la pagina, crea subnavBars para las selecciones y para los inputs de cada seleccion
function createSubNavbar(id, items, isInput) {
    if (isInput) {
        const navItems = items.map(item => createNavInput(item.id, item.iconClass, item.text, item.inputType, item.inputId)).join('');
        return `
            <nav id="${id}" class="subnavbar">
                <ul class="navbar-nav">
                    ${createNavItem('', 'fa-solid fa-arrow-left', 'Volver', 'backButton')}
                    ${navItems}
                    ${createNavButton('create-button', `${id}-create-button`, `Crear ${isInput}`, `handleCreate('${id}')`)}
                    ${createNavButton('edit-button', `${id}-edit-button`, `Editar ${isInput}`, `applyChanges()`)}
                    ${createNavButton('delete-button', `${id}-delete-button`, `Eliminar ${isInput}`, `handleDelete()`)}
                </ul>
            </nav>
        `;
    }else {
        const navItems = items.map(item => createNavItem(item.id, item.iconClass, item.text)).join('');
        return `
            <nav id="${id}" class="subnavbar">
                <ul class="navbar-nav">
                    ${createNavItem('', 'fa-solid fa-arrow-left', 'Volver', 'backButton')}
                    ${navItems}
                </ul>
            </nav>
        `;
    }
}

// Agrega los navbars al container del archivo html
let isInput;
document.getElementById('nav-container').innerHTML = `
    ${createNavbar()}
    ${createSubNavbar('subnavbar0', [
        { id: '', iconClass: '', text: 'Titulo', inputType: 'text', inputId: 'tituloPagina'},
        { id: '', iconClass: '', text: 'Color', inputType: 'color', inputId: 'colorBody'},
        { id: '', iconClass: '', text: 'Fuente', inputType: 'text', inputId: 'fuenteBody'},
        { id: '', iconClass: '', text: 'Alineacion', inputType: 'select', inputId: 'alignBody'},
        { id: '', iconClass: '', text: 'Altura-Linea', inputType: 'number', inputId: 'alturaBody'},
    ], isInput = 'Body')}
    ${createSubNavbar('subnavbar1', [
        { id: 'opcionImagen', iconClass: 'fa-solid fa-images', text: 'Imagenes' },
        { id: 'opcionVideo', iconClass: 'fa-solid fa-video', text: 'Videos' }
    ])}
    ${createSubNavbar('subnavbar2', [
        { id: 'opcionTitulos', iconClass: 'fa-solid fa-heading', text: 'Titulos' },
        { id: 'opcionParrafos', iconClass: 'fa-solid fa-paragraph', text: 'Parrafos' },
        { id: 'opcionLink', iconClass: 'fa-solid fa-link', text: 'Links' }
    ])}
    ${createSubNavbar('subnavbar-a', [
        { id: '', iconClass: '', text: 'Texto', inputType: 'text', inputId: 'textoLinks'},
        { id: '', iconClass: '', text: 'Link', inputType: 'text', inputId: 'link'},
        { id: '', iconClass: '', text: 'Tamaño', inputType: 'number', inputId: 'tamañoLinks'},
        { id: '', iconClass: '', text: 'Color', inputType: 'color', inputId: 'colorLinks'},
        { id: '', iconClass: '', text: 'Negrilla', inputType: 'checkbox', inputId: 'negrillaLinks'},
        { id: '', iconClass: '', text: 'Subrayado', inputType: 'checkbox', inputId: 'subrayadoLinks'}
    ], isInput = 'Link')}
    ${createSubNavbar('subnavbar-h1', [
        { id: '', iconClass: '', text: 'Texto', inputType: 'text', inputId: 'textoTitulos'},
        { id: '', iconClass: '', text: 'Tamaño', inputType: 'number', inputId: 'tamañoTitulos'},
        { id: '', iconClass: '', text: 'Color', inputType: 'color', inputId: 'colorTitulos'},
        { id: '', iconClass: '', text: 'Negrilla', inputType: 'checkbox', inputId: 'negrillaTitulos'}
    ], isInput = 'Titulo')}
    ${createSubNavbar('subnavbar-p', [
        { id: '', iconClass: '', text: 'Texto', inputType: 'textarea', inputId: 'textoParrafos'},
        { id: '', iconClass: '', text: 'Tamaño', inputType: 'number', inputId: 'tamañoParrafos'},
        { id: '', iconClass: '', text: 'Color', inputType: 'color', inputId: 'colorParrafos'},
        { id: '', iconClass: '', text: 'Negrilla', inputType: 'checkbox', inputId: 'negrillaParrafos'}
    ], isInput = 'Parrafo')}
    ${createSubNavbar('subnavbar-img', [
        { id: '', iconClass: '', text: 'Imagen', inputType: 'file', inputId: 'srcImagen'},
        { id: '', iconClass: '', text: 'Largo', inputType: 'number', inputId: 'largoImagen'},
        { id: '', iconClass: '', text: 'Ancho', inputType: 'number', inputId: 'anchoImagen'},
        { id: '', iconClass: '', text: 'Borde', inputType: 'checkbox', inputId: 'bordeImagen'},
        { id: '', iconClass: '', text: 'Borde Radio', inputType: 'number', inputId: 'radioImagen'}
    ], isInput = 'Imagen')}
    ${createSubNavbar('subnavbar-video', [
        { id: '', iconClass: '', text: 'Video', inputType: 'file', inputId: 'srcVideo'},
        { id: '', iconClass: '', text: 'Largo', inputType: 'number', inputId: 'largoVideo'},
        { id: '', iconClass: '', text: 'Ancho', inputType: 'number', inputId: 'anchoVideo'},
        { id: '', iconClass: '', text: 'Borde', inputType: 'checkbox', inputId: 'bordeVideo'},
        { id: '', iconClass: '', text: 'Borde Radio', inputType: 'number', inputId: 'radioVideo'},
        { id: '', iconClass: '', text: 'Loop', inputType: 'checkbox', inputId: 'loopVideo'},
        { id: '', iconClass: '', text: 'AutoPlay', inputType: 'checkbox', inputId: 'playVideo'},
    ], isInput = 'Video')}
    
`;

//Crea los subnavbars ocultos en la pagina
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navBar');

    function obtenerSubNavBar(opcion) {
        let subnavbar;
        switch (opcion) {
            case 'opcionMedia':
                subnavbar = document.getElementById('subnavbar1');
                break;
            case 'opcionText':
                subnavbar = document.getElementById('subnavbar2');
                break;
            case 'opcionTitulos':
                subnavbar = document.getElementById('subnavbar-h1');
                break;
            case 'opcionParrafos':
                subnavbar = document.getElementById('subnavbar-p');
                break;
            case 'opcionLink':
                subnavbar = document.getElementById('subnavbar-a');
                break;
            case 'opcionImagen':
                subnavbar = document.getElementById('subnavbar-img');
                break;
            case 'opcionVideo':
                subnavbar = document.getElementById('subnavbar-video');
                break;
            case 'opcionCuerpo':
                subnavbar = document.getElementById('subnavbar0');
            default:
                break;
        }

        if (subnavbar && subnavbar.style.left !== '0px') {
            subnavbar.style.left = '0';
            navbar.style.left = '-250px';
        }
    }

    //Agrega la funcionalidad en el menu principal a cuando el usuario hace click en alguna opcion de la pagina
    const navbarContainer = document.querySelector('.navbar-nav');
    navbarContainer.addEventListener('click', function(event) {
        const target = event.target;
        if (target.matches('.nav-link')) {
            const parentNavItem = target.closest('.nav-item');
            if (parentNavItem && parentNavItem.id) {
                const opcion = parentNavItem.id;
                obtenerSubNavBar(opcion);
            } else {
                console.warn('Clicked element does not have a valid ID');
            }
        }
    });

    //Agrega la funcionalidad al boton de volver en la pagina
    document.querySelectorAll('.subnavbar .backButton').forEach(button => {
        button.addEventListener('click', function() {
            const subnavbar = this.closest('.subnavbar');
            if (subnavbar) {
                subnavbar.style.left = '-250px';
                navbar.style.left = '0';
                 // Mostrar botones de edición y eliminación, ocultar botón de creación
                document.querySelectorAll('.create-button').forEach(button => {
                    button.style.display = 'block';
                    const navItem = button.closest('.nav-item');
                if (navItem) {
                    navItem.style.display = 'block';
                }
                });
                document.querySelectorAll('.edit-button').forEach(button => {
                    button.style.display = 'none';
                });
                document.querySelectorAll('.delete-button').forEach(button => {
                    button.style.display = 'none';
                });
            }
            const iframe = document.getElementById('preview-iframe');
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const allElements = iframeDocument.querySelectorAll('*');
            allElements.forEach(el => el.style.outline = 'none');
        });
    });

    //Agrega la funcionalidad a las subnavbars para las opciones secundarias, para pasar a las lista de inputs para el usuario
    document.querySelectorAll('.subnavbar').forEach(subnavbar => {
        subnavbar.addEventListener('click', function(event) {
            const target = event.target;
            if (target.matches('.nav-link')) {
                const parentNavItem = target.closest('.nav-item');
                if (parentNavItem && parentNavItem.id) {
                    const opcion = parentNavItem.id;
                    obtenerSubNavBar(opcion);
                } else {
                    console.warn('Clicked element does not have a valid ID');
                }
            }
        });
    });

    // Asigna manejador para el input de subida de imágenes
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', handleImageUpload);
    });

    // Evento para el botón de exportar
    document.getElementById('export-button').addEventListener('click', exportPage);
    // Evento para el botón de ver página
    document.getElementById('view-button').addEventListener('click', viewPage);

    // Añadir un event listener al iframe para detectar clics en las etiquetas
    function setupIframeClickListener() {
        const iframe = document.getElementById('preview-iframe');
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        iframeDocument.addEventListener('click', function(event) {
                const clickedElement = event.target;
                if(clickedElement.tagName.toLowerCase() === 'html'){
                    console.log('no puedes escoger html')
                }else{
                    currentElement = event.target;
                    handleEdit();
                    highlightElement(clickedElement);
                    event.preventDefault();
                    openSubNavbar(clickedElement.tagName.toLowerCase());
                    
                }
            
        });
    }

    // Llama a la función para configurar el listener cuando el iframe esté cargado
    document.getElementById('preview-iframe').onload = setupIframeClickListener;


    function openSubNavbar(tagName) {
        // Ocultar todos los subnavbars
        const subnavbars = document.querySelectorAll('.subnavbar');
        subnavbars.forEach(subnavbar => {
            subnavbar.style.left = '-250px';
        });

        // Mostrar el subnavbar correspondiente basado en tagName
        const subnavbarId = `subnavbar-${tagName}`;
        const subnavbar = document.getElementById(subnavbarId);
        if (subnavbar) {
            subnavbar.style.left = '0';
            navbar.style.left = '-250px'; // Mover el navbar principal
        }

        // Mostrar botones de edición y eliminación, ocultar botón de creación
        document.querySelectorAll('.create-button').forEach(button => {
            button.style.display = 'none';
            const navItem = button.closest('.nav-item');
                if (navItem) {
                    navItem.style.display = 'none';
                }
        });
        document.querySelectorAll('.edit-button').forEach(button => {
            button.style.display = 'block';
        });
        document.querySelectorAll('.delete-button').forEach(button => {
            button.style.display = 'block';
        });
    }
});

function exportPage() {
    // Obtener el iframe y su contenido
    const iframe = document.getElementById('preview-iframe');
    const iframeContent = iframe.contentDocument || iframe.contentWindow.document;

    // Obtener el contenido HTML del iframe
    const html = iframeContent.documentElement.outerHTML;

    // Usar js-beautify para formatear el HTML
    const formattedHtml = js_beautify(html, { indent_size: 2, space_in_empty_paren: true });

    // Crear un Blob con el contenido HTML formateado como texto
    const blob = new Blob([formattedHtml], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Crear un enlace de descarga y simular el clic para iniciar la descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pagina-web.txt';
    document.body.appendChild(a);
    a.click();

    // Limpiar el DOM
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Agregar el siguiente script para importar js-beautify
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify.min.js';
document.head.appendChild(script);

function viewPage() {
    const win = window.open();
    win.document.write(html);
    win.document.close();
}

