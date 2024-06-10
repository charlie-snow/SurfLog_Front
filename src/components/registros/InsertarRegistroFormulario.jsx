import { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineCamera } from 'react-icons/ai';
import useLugares from "../../hooks/useLugares";
import { ContextoPersonal } from "../../contexts/ContextoPersonal";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment-timezone";

import { uploadToS3 } from "../../utils/gestorS3";
import { nanoid } from "nanoid";
import { NavLink } from "react-router-dom";


const VideoPreview = ({ videoUrl, altura }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleVideoClick = () => {
        // Open the video in a new window when clicked
        window.open(videoUrl, '_blank');
    };

    const handleVideoError = () => {
        // Handle video loading errors
        setHasError(true);
        setIsLoading(false);
    };

    const handleLoadStart = () => {
        // Video loading has started
        setIsLoading(true);
    };

    const handleLoadedData = () => {
        // Video has loaded data and is ready to play
        setIsLoading(false);
    };

    return (
        <div>
            <video
                controls
                onClick={handleVideoClick}
                onMouseEnter={() => setIsPlaying(true)}
                onMouseLeave={() => setIsPlaying(false)}
                onError={handleVideoError}
                onLoadStart={handleLoadStart}
                onLoadedData={handleLoadedData}
                style={{ height: `${altura}` }}            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {hasError && <p>Error loading the video</p>}
            {/* {isPlaying && !hasError && <p>Click to open the video</p>} */}
            {isLoading && <p>Cargando vídeo...</p>}
        </div>
    );
};

const InsertarRegistroFormulario = ({ pruebas, setPruebas }) => {

    // const [pruebas, setPruebas] = useState(!admin);
    const [registrando, setRegistrando] = useState(false);
    const [exito, setExito] = useState(false);
    const { admin_estado } = useContext(ContextoPersonal);
    const [admin, setAdmin] = admin_estado;
    const [adjuntos, setAdjuntos] = useState([]);

    const ruta_archivos_registros = "registros/";
    const ruta_archivos_registros_pruebas = "registros/pruebas/";

    let url_registros = pruebas ? "/registros/pruebas" : "/registros";

    const [procesamientos, setProcesamientos] = useState([
        { id: 1, nombre: 'Insertar Registro', estado: 'en espera', mensaje: '' },
        { id: 2, nombre: 'Recopilar datos de APIs', estado: 'en espera', mensaje: '' }
    ]);

    const addProcesamiento = (nombre) => {
        const procesamiento = {
            id: procesamientos.length + 1,
            nombre: nombre,
            estado: 'en espera',
            mensaje: ''
        };
        setProcesamientos(procesamientos_anteriores => [procesamiento, ...procesamientos_anteriores]);
    };

    const changeEstadoProcesamiento = (nombre, estado, mensaje = "") => {
        setProcesamientos(procesamientos_anteriores => {
            return procesamientos_anteriores.map(procesamiento => {
                if (procesamiento.nombre === nombre) {
                    return {
                        ...procesamiento,
                        estado: estado,
                        mensaje: mensaje
                    };
                }
                return procesamiento;
            });
        });
    };

    useEffect(() => {
        setPruebas(!admin);
    }, [admin])

    // const ahora = new Date();
    // const ahoraISO = ahora.toISOString()
    // console.log("ahoraISO: " + ahoraISO);
    const predefinido = null;
    const [campos, setCampos] = useState({
        // momento: ahora,
        numero_olas: predefinido,
        gente: predefinido,
        que_tal_olas: predefinido,
        que_tal_yo: predefinido,
        texto: predefinido,
    });
    const sampleFormData = {
        usuario_id: 1,
        altura_marea: predefinido,
        altura_ola: predefinido,
        direccion_ola: predefinido,
        direccion_viento: predefinido,
        foto_sesion: predefinido,
        fotos_sesion: predefinido,
        lluvia: predefinido,
        nubes: predefinido,
        periodo_ola: predefinido,
        punto_marea: predefinido,
        subiendo_marea: predefinido,
        temperatura_agua: predefinido,
        temperatura_ambiente: predefinido,
        tiempo: predefinido,
        velocidad_viento: predefinido,
    };
    const [mensaje, setMensaje] = useState();

    const { lugares } = useLugares();

    useEffect(() => {
        setMensaje("");
    }, []);


    // const getHoraActualEsp = () => {
    //     const ahora_utc = new Date();
    //     // const ahora_utc = ahora_utc.toISOString();
    //     console.log("ahora_utc: ", ahora_utc);
    //     if (ahora_utc.getUTCMinutes() > 30) {
    //         // Increase the hour by one
    //         ahora_utc.setUTCHours(ahora_utc.getUTCHours() + 1);
    //     }
    //     const ahora_utc_iso = ahora_utc.toISOString();
    //     console.log("ahora_utc_iso: ", ahora_utc_iso);
    //     // // 2024-03-11T14:05:03.959Z  (hora española actual: 15:06)

    //     const ahora_esp = ahora_utc.toLocaleString("sp-ES", {
    //         timeZone: "Europe/Madrid",
    //     });
    //     console.log("ahora_esp: ", ahora_esp);
    //     // 11/3/2024, 15:22:42  (hora española actual: 15:22)

    //     // const ahora_esp_iso = new Date(ahora_esp).toISOString();
    //     // console.log("ahora_esp_iso: ", ahora_esp_iso);
    //     // // Convert to ISO 8601 format:  2024-03-11T14:05:03.000Z

    //     // const momento = ahora_utc_iso.slice(0, 13) + ":00";
    //     // console.log("momento: ", momento);

    //     // Original date and time string
    //     // const dateString = ahora_esp.split(",")[0];
    //     // const timeString = ahora_esp
    //     //   .split(",")[1]
    //     //   .substring(1, ahora_esp.split(",")[1].length - 1);

    //     const minutes = ahora_utc.getMinutes();

    //     const year = ahora_utc.getFullYear();
    //     const month = ahora_utc.getMonth() + 1; // Months are zero-indexed, so we add 1
    //     const day = ahora_utc.getDate();

    //     const hours = ahora_utc.getHours();
    //     const seconds = ahora_utc.getSeconds();

    //     console.log(year);
    //     console.log(minutes);

    //     // const [day, month, year] = dateString.split("/");
    //     // const [month, day, year] = dateString.split("/");
    //     // const [hours, minutes, seconds] = timeString.split(":");

    //     // Create an object with individual values in Spanish
    //     const dateObject = {
    //         dia: parseInt(day, 10),
    //         mes: parseInt(month, 10),
    //         año: parseInt(year, 10),
    //         horas: parseInt(hours, 10),
    //         minutos: parseInt(minutes, 10),
    //         segundos: parseInt(seconds, 10),
    //         getHoraIso: () => {
    //             const formattedDateString = `${dateObject.año}-${dateObject.mes < 10 ? "0" + dateObject.mes : dateObject.mes
    //                 }-${dateObject.dia < 10 ? "0" + dateObject.dia : dateObject.dia}T${dateObject.horas < 10 ? "0" + dateObject.horas : dateObject.horas
    //                 }:${dateObject.minutos < 10 ? "0" + dateObject.minutos : dateObject.minutos
    //                 }:${dateObject.segundos < 10
    //                     ? "0" + dateObject.segundos
    //                     : dateObject.segundos
    //                 }`;
    //             return formattedDateString;
    //         },
    //     };
    //     return dateObject;
    // };

    const [momento, setmomento] = useState(new Date());
    const timeZone = 'Europe/Madrid';

    const [mostrar_selector_momento, setmostrar_selector_momento] = useState(false);
    const [texto_boton_momento, settexto_boton_momento] = useState('ahora');

    const al_click_boton_cambiar_momento = (evento) => {
        evento.preventDefault();
        setmostrar_selector_momento(true);
    };

    const al_cambiar_momento = (date) => {
        setmomento(date);
        setmostrar_selector_momento(false);
        settexto_boton_momento(date.toLocaleString("es-SP", {
            timeZone: "Europe/Madrid",
            hour12: false, // Use 24-hour format
            hour: "2-digit", // Display hours with leading zero
            minute: "2-digit", // Display minutes with leading zero
            day: "2-digit", // Display day with leading zero
            month: "2-digit", // Display month with leading zero
            year: "numeric" // Display full year
        }));
    };
    const togglePruebas = () => {
        setPruebas((prevValue) => !prevValue);
    };

    const handleChange = (e) => {
        console.log(e);
        setCampos({
            ...campos,
            [e.target.name]: e.target.value,
        });
    };

    const handleCapture = async (evento) => {
        // console.log(e);

        if (evento.target.files && evento.target.files.length !== 0) {
            const archivo = evento.target.files[0];
            let ruta = "";
            let tipo = "";

            ruta = URL.createObjectURL(archivo);

            tipo = archivo.type;
            setAdjuntos([
                ...adjuntos, {
                    archivo: archivo,
                    ruta: ruta,
                    tipo: tipo
                }]);
        }
    };

    async function peticionServidor(formData) {
        // console.log(JSON.stringify(usuario));
        let datos;
        try {
            const respuesta = await fetch(
                `${import.meta.env.VITE_REACT_HOST}/registro`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            console.log("Respuesta: ")
            console.log(respuesta);
            datos = await respuesta.json();
            // console.log(datos);
            setMensaje(datos.message);
            // console.log(mensaje);
            if (!respuesta.ok) {
                setMensaje("Error insertando registro: " + datos.message);
                // setMensaje(mensaje + " - Error al intentar registrar");
                console.log(
                    `Error en la petición: ${respuesta.status} - ${respuesta.statusText} - ${datos.message}`
                );
                return datos;
            }
            setExito(true);
            // setRegistrando(false);

            return datos;
        } catch (error) {
            setMensaje("/registro POST - Error indefinido: " + error.message);
            console.log("Error: " + error.message);
        }
    }

    async function insertarRegistro(evento) {
        evento.preventDefault();
        // let mensaje = "";
        setRegistrando(true);
        setPruebas(pruebas);
        let CamposValidos = true;

        const localMoment = moment.tz(momento, timeZone);

        // Convert to UTC
        const utcMoment = localMoment.utc();

        // Get the UTC date as a JavaScript Date object
        const utcDate = utcMoment.toISOString();

        const ahora_utc = new Date(momento);
        const ahora_utc_iso = ahora_utc.toISOString();
        console.log("ahora_utc_iso: front ", ahora_utc_iso);
        // 2024-03-11T14:05:03.959Z  (hora española actual: 15:06)

        setmomento(utcDate);
        console.log("utcDate: " + utcDate);

        const mensaje_titulo = `Insertando Registro: ${momento.toISOString()} - ${evento.target.elements.lugar_id.value}`;
        setMensaje(mensaje_titulo);

        changeEstadoProcesamiento('Registrar', 'procesando');

        let formData = new FormData();

        // formData.append("momento", "2024-06-10T13:31:20.000Z");
        formData.append("momento", utcDate);

        formData.append("lugar_id", evento.target.elements.lugar_id.value);
        formData.append("pruebas", pruebas ? '1' : '0');

        for (const key in campos) {
            formData.append(key, campos[key]);
        }

        for (const key in sampleFormData) {
            formData.append(key, sampleFormData[key]);
        }

        if (adjuntos && adjuntos.length !== 0) {
            setMensaje(mensaje_titulo + `<br> + insertando adjuntos...`);

            addProcesamiento('Insertar Adjuntos');
            changeEstadoProcesamiento('Insertar Adjuntos', 'procesando');

            await Promise.all(adjuntos.map(async (adjunto, index) => {
                let tipo = "desconocido";
                // console.log("Adjunto: ");
                // console.log(adjunto);
                let ahora = new Date()
                    .toISOString()
                    .slice(0, 19)
                    // .r1eplace("T", " ")
                    .replace(/:/g, "_");

                const extension = adjunto.archivo.name.split(".");

                const nombre_archivo =
                    ahora +
                    "-" +
                    String(evento.target.elements.lugar_id.value).padStart(3, "0") +
                    "-" +
                    nanoid().substring(1, 5) +
                    "." +
                    extension.pop();

                console.log(
                    "\x1b[38;5;214m%s\x1b[0m",
                    "nombrearchivo: " + nombre_archivo
                );

                const ruta = pruebas ? ruta_archivos_registros_pruebas + nombre_archivo : ruta_archivos_registros + nombre_archivo;
                switch (true) {
                    case adjunto.tipo.includes("image"):
                        console.log("Gestionando foto " + ruta);
                        tipo = "fotos";
                        break;
                    case adjunto.tipo.includes("video"):
                        console.log("Gestionando video " + ruta);
                        tipo = "videos";
                        break;
                    default:
                        console.log("Subida abortada: Tipo de archivo desconocido");
                        tipo = "desconocido";
                        break;
                }
                setMensaje(mensaje_titulo + `<br> + insertando adjunto: ${ruta}`);
                try {
                    await uploadToS3(adjunto.archivo, ruta);
                    formData.append(tipo, ruta);
                } catch {
                    console.log("Error subiendo el archivo: " + ruta)
                }
            }));
            changeEstadoProcesamiento('Insertar Adjuntos', 'finalizado correcto');
        }
        console.log("formData datos a enviar >>>>>>>");
        console.log(formData);

        changeEstadoProcesamiento('Insertar Registro', 'procesando');
        changeEstadoProcesamiento('Recopilar datos de APIs', 'procesando');

        if (CamposValidos) {
            await peticionServidor(formData);
        }

        changeEstadoProcesamiento('Recopilar datos de APIs', 'finalizado correcto');
        changeEstadoProcesamiento('Insertar Registro', 'finalizado correcto');

        changeEstadoProcesamiento('Registrar', 'finalizado correcto');

        // setMensaje(mensaje);
    }

    return (
        <>
            <form onSubmit={insertarRegistro} className="max-w-md mx-auto">
                {registrando ? (
                    <>
                        {admin && (
                            <div className={`w-fit mt-6 p-2 bg-white rounded text-center`}>
                                <div dangerouslySetInnerHTML={{ __html: mensaje }} />
                            </div>

                        )}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Registrando...</h3>
                            {procesamientos.map(procesamiento => (
                                <>
                                    <div className="flex items-center">
                                        {procesamiento.estado === 'en espera' && (
                                            <span role="img" aria-label="En Espera" className="mr-2">
                                                ⏳
                                            </span>
                                        )}
                                        {procesamiento.estado === 'procesando' && (
                                            <img src="/img/cargando_sol_azul.png" alt="Procesando..." className="w-6 h-6 mr-2" />
                                        )}
                                        {procesamiento.estado === 'finalizado correcto' && (
                                            <span role="img" aria-label="Finalizado Correcto" className="mr-2">
                                                ✅
                                            </span>
                                        )}
                                        {procesamiento.estado === 'finalizado con errores' && (
                                            <span role="img" aria-label="Finalizado con Errores" className="mr-2">
                                                ❌
                                            </span>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">{procesamiento.nombre}</h3>
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                        {exito && (
                            <div className="flex flex-col items-center justify-center m-2">
                                <p className="text-xl text-green-700 font-bold p-3">Registrado correctamente</p>
                                <button className="p-3 bg-blue-500 text-white rounded-md">
                                    <NavLink to={url_registros} className=" hover:font-bold">
                                        <div className="flex gap-2">
                                            <b>Ver Registros</b>
                                        </div>
                                    </NavLink>

                                </button>
                            </div>

                        )}
                    </>
                ) : (
                    <>
                        <div className="mb-2 flex flex-col items-center">
                            <label htmlFor="icon-button-file" className="cursor-pointer block text-center">
                                <span>
                                    <span className="rounded-full bg-gray-200 hover:bg-gray-300 inline-block p-1">
                                        <AiOutlineCamera className="h-10 w-10 text-gray-600" />
                                    </span>

                                    <input
                                        accept="image/*,video/*"
                                        id="icon-button-file"
                                        type="file"
                                        capture="environment"
                                        className="hidden"
                                        name="adjuntos"
                                        onChange={(e) => handleCapture(e)}
                                        multiple
                                    />
                                </span>
                            </label>
                            <button onClick={al_click_boton_cambiar_momento}>{texto_boton_momento}</button>
                            {mostrar_selector_momento && (
                                <div className="date-picker-popup">
                                    <DatePicker
                                        selected={momento}
                                        onChange={al_cambiar_momento}
                                        showTimeSelect
                                        timeIntervals={15}
                                        dateFormat="dd/MM/YYY hh:mm"
                                    />
                                </div>
                            )}

                            <div className="flex flex-wrap">{adjuntos.length !== 0 && adjuntos.map((adjunto) => (
                                // console.log(adjunto.tipo);
                                // (adjunto.archivo.type.includes("image")) ? (
                                (adjunto.tipo.includes("image")) ? (
                                    <div key={adjunto.id} className="m-1 p-1">
                                        {/* < div className = "w-16 h-16 bg-gray-300 mx-auto aspect-w-1 aspect-h-1 p-1" > */}
                                        <img src={adjunto.ruta} alt={adjunto.ruta} className="w-16 h-16 object-cover rounded-2xl p-1" />
                                    </div>
                                    // </div>
                                ) : (
                                    (adjunto.tipo.includes("video")) && (
                                        <div key={adjunto.id} className="w-16 h-16">
                                            <VideoPreview videoUrl={adjunto.ruta} altura="50px" />
                                        </div>
                                    )
                                )


                            )
                            )}</div>

                        </div>

                        {admin && (
                            <button
                                type="button"
                                onClick={togglePruebas}
                                className={`mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ${pruebas ? '' : 'opacity-50 transition-opacity'
                                    }`}
                            >
                                {pruebas ? 'De prueba' : 'Real'}
                            </button>
                        )}
                        <div className="mb-2">
                            <label htmlFor="lugar_id" className="block text-sm font-medium text-gray-700">
                                Lugar
                            </label>
                            {!lugares ? (
                                <div className="flex">
                                    <img src="/img/cargando_sol_azul.png" alt="Procesando..." className="w-6 h-6 mr-2" />
                                    <p>Recuperando lugares</p>
                                </div>
                            ) : (
                                <>
                                    <select
                                        id="lugar_id"
                                        name="lugar_id"
                                        className="w-full p-1 border border-gray-300 rounded-md"
                                        defaultValue="13"
                                    >
                                        {lugares.map((lugar) => (
                                            <option key={lugar.id} value={lugar.id}>
                                                {lugar.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="block mx-auto p-3 bg-blue-500 text-white rounded-md"
                        >
                            Registrar {pruebas && '(modo prueba)'}
                        </button>

                        {Object.keys(campos).map((key) => (
                            <div key={key} className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">{key.replace(/_/g, ' ')}</label>
                                <input
                                    type="text"
                                    name={key}
                                    value={campos[key]}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md"
                                // className="mt-1 p-1 border rounded-md w-full"
                                />
                            </div>
                        ))}
                    </>
                )}
            </form >
        </>
    );
}
export default InsertarRegistroFormulario;