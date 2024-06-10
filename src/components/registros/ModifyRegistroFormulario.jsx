import { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineCamera } from 'react-icons/ai';
import useLugares from "../../hooks/useLugares";
import CampoRegistroFormulario from "../registros/CampoRegistroFormulario";
import ModifyRegistro from "../../models/ModifyRegistro";

import { ContextoPersonal } from "../../contexts/ContextoPersonal";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Zoom from 'react-medium-image-zoom'


import { uploadToS3 } from "../../utils/gestorS3";
import { getFromS3 } from "../../utils/gestorS3";

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
                style={{ height: `${altura}`, display: isLoading ? 'none' : 'block' }} // Initially hidden, will be shown after loading
                onClick={handleVideoClick}
                onMouseEnter={() => setIsPlaying(true)}
                onMouseLeave={() => setIsPlaying(false)}
                onError={handleVideoError}
                onLoadedData={() => {
                    handleLoadedData();
                }}
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {isLoading && (
                <img
                    className="w-72 h-51 object-cover rounded-2xl"
                    src="/img/cargando_surfer_video.gif"
                    alt="Cargando..."
                />
            )}
        </div>
    )

};

const PresentarImagen = ({ url }) => {

    const [cargando, setCargando] = useState(true);

    return (
        <div>
            <Zoom>
                <img
                    className="w-72 h-51 object-cover rounded-2xl"
                    style={{ display: cargando ? 'none' : 'block' }}
                    src={url}
                    onLoad={() => setCargando(false)} // Once loaded, hide the loading indicator and display the image
                />
            </Zoom>


            {cargando && (
                <img
                    className="w-72 h-51 object-cover rounded-2xl"
                    src="/img/cargando_surfer_imagen.gif"
                    alt="Cargando..."
                />
            )}
        </div>
    )

};

const ModifyRegistroFormulario = ({ registro, pruebas }) => {

    const [adjuntos, setAdjuntos] = useState([]);
    const [registroModificado, setRegistroModificado] = useState(registro);

    const [registrando, setRegistrando] = useState(false);
    const [exito, setExito] = useState(false);
    const { admin_estado } = useContext(ContextoPersonal);
    const [admin, setAdmin] = admin_estado;
    const campos_modificables = ["texto", "que_tal_olas", "que_tal_yo", "numero_olas", "gente"];

    const ruta_archivos_registros = "registros/";
    const ruta_archivos_registros_pruebas = "registros/pruebas/";

    let url_registros = pruebas ? "/registros/pruebas" : "/registros";

    const [procesamientos, setProcesamientos] = useState([
        { id: 1, nombre: 'Modificar Registro en base de datos', estado: 'en espera', mensaje: '' },
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

    console.log(registroModificado);

    const { lugares } = useLugares();

    const [mensaje, setMensaje] = useState();

    useEffect(() => {
        const getAdjuntos = async (registro) => {
            // console.log(registro.adjuntos);
            if (registro.adjuntos && registro.adjuntos.length !== 0) {
                const adjuntosPromises = registro.adjuntos.map(async (adjunto) => {
                    try {
                        let cargando = true;
                        console.log(adjunto.ruta);
                        const url_persigned_archivo = await getFromS3(adjunto.ruta);
                        console.log(url_persigned_archivo);

                        cargando = false;
                        return { adjunto, url_persigned_archivo, cargando };
                    } catch (error) {
                        console.error("Error fetching attachment:", error);
                        return { adjunto, url_persigned_archivo: null, cargando: false };
                    }
                });

                const adjuntosData = await Promise.all(adjuntosPromises);
                setAdjuntos(adjuntosData);
            }
        };
        setMensaje("");
        getAdjuntos(registro);
    }, [registro.adjuntos]);

    const [momento, setmomento] = useState(registro.momento);
    const [mostrar_selector_momento, setmostrar_selector_momento] = useState(false);
    const [texto_boton_momento, settexto_boton_momento] = useState(registroModificado.momento);

    const al_click_boton_cambiar_momento = (evento) => {
        evento.preventDefault();
        setmostrar_selector_momento(true);
    };

    const al_cambiar_momento = (date) => {
        // console.log("date: " + date)
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
        setRegistroModificado({
            ...registroModificado,
            ["momento"]: momento,
        });
    };

    const handleChange = (e) => {
        console.log(e.target.value);
        setRegistroModificado({
            ...registroModificado,
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

    async function modificarRegistro(evento) {
        evento.preventDefault();
        // console.log(registroModificado)
        ModifyRegistro(registroModificado, pruebas);
    }

    return (
        <>
            <form onSubmit={modificarRegistro} className="max-w-md mx-auto">
                {registrando ? (
                    <>
                        {admin && (
                            <div className={`w-fit mt-6 p-2 bg-white rounded text-center`}>
                                <div dangerouslySetInnerHTML={{ __html: mensaje }} />
                            </div>

                        )}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Modificando registro ...</h3>
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
                                <p className="text-xl text-green-700 font-bold p-3">Registro modificado correctamente</p>
                                <button className="p-3 bg-blue-500 text-white rounded-md">
                                    <NavLink to={url_registros} className=" hover:font-bold">
                                        <div className="flex gap-2">
                                            <b>Ver Registro</b>
                                        </div>
                                    </NavLink>

                                </button>
                            </div>

                        )}
                    </>
                ) : (
                    <>
                        <div>Modificar Registro: {registro.registro_id}</div>
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
                                        selected={new Date(registroModificado.momento)}
                                        onChange={al_cambiar_momento}
                                        showTimeSelect
                                        timeIntervals={15}
                                        dateFormat="dd/MM/YYY hh:mm"
                                    />
                                </div>
                            )}

                            <div className="flex flex-wrap">

                                {adjuntos.map(({ adjunto, url_persigned_archivo, cargando }) => {

                                    return (
                                        adjunto.tipo === "foto" ? (
                                            <div key={adjunto.id} className="m-1 p-1">
                                                <PresentarImagen url={url_persigned_archivo} alt={adjunto.ruta} />
                                            </div>
                                        ) : (
                                            adjunto.tipo === "video" && (
                                                <div key={adjunto.id} className="m-1 p-1">
                                                    <VideoPreview videoUrl={url_persigned_archivo} alt={adjunto.ruta} altura="162px" />
                                                </div>
                                            )
                                        )
                                    );

                                })}
                            </div>
                        </div>

                        {/* {admin && (
                            <button
                                type="button"
                                onClick={togglePruebas}
                                className={`mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ${pruebas ? '' : 'opacity-50 transition-opacity'
                                    }`}
                            >
                                {pruebas ? 'De prueba' : 'Real'}
                            </button>
                        )} */}
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

                                <div className="mb-2">
                                    <div className="flex">
                                        <select
                                            name="lugar_id"
                                            className="w-full p-1 border border-gray-300 rounded-md max-w-36"
                                            defaultValue={registroModificado.lugar_id}
                                            onChange={handleChange}

                                        >
                                            {lugares.map((lugar) => (
                                                <option key={lugar.id} value={lugar.id}>
                                                    {lugar.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="text-center max-w-46 overflow-x-auto">
                                            <div>original</div>
                                            <div>{registro.lugar_nombre}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* {Object.keys(registroModificado).map((key) => {
                            if (key !== "adjuntos" && key !== "relo") {
                                return (<CampoRegistroFormulario llave={key} valor_modificado={registroModificado[key]} valor={registro[key]} handleChange={handleChange} />)
                            }
                        })} */}

                        {/* {campo = "registro_id"} */}
                        {campos_modificables.map((campo) => (
                            <CampoRegistroFormulario campo={campo} valor_modificado={registroModificado[campo]} valor={registro[campo]} handleChange={handleChange} />
                        ))}

                        <button
                            type="submit"
                            className="block mx-auto p-3 bg-blue-500 text-white rounded-md"
                        >
                            Modificar {pruebas && '(modo prueba)'}
                        </button>
                    </>
                )}
            </form >
        </>
    );
}
export default ModifyRegistroFormulario;