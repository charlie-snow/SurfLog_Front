
const ModifyRegistro = async (registro, pruebas) => {

    async function peticionServidor(formData) {
        let datos;
        let ruta = `${import.meta.env.VITE_REACT_HOST}/registro/${registro.registro_id}`;
        if (pruebas) {
            ruta += "?pruebas=true";
        }
        try {
            const respuesta = await fetch(
                ruta,
                // http://localhost:4000/registro/1?pruebas=true
                {
                    method: "PUT",
                    body: formData,
                }
            );
            console.log("Respuesta: ")
            console.log(respuesta);
            datos = await respuesta.json();
            // console.log(datos);
            // setMensaje(datos.message);
            // console.log(mensaje);
            if (!respuesta.ok) {
                // setMensaje("Error insertando registro: " + datos.message);
                // setMensaje(mensaje + " - Error al intentar registrar");
                console.log(
                    `Error en la petición: ${respuesta.status} - ${respuesta.statusText} - ${datos.message}`
                );
                return datos;
            }
            // setExito(true);
            // setRegistrando(false);

            return datos;
        } catch (error) {
            // setMensaje("/registro POST - Error indefinido: " + error.message);
            console.log("Error: " + error.message);
        }
    }

    // setRegistrando(true);
    let CamposValidos = true;

    // const ahora_utc = new Date(momento);
    // const ahora_utc_iso = ahora_utc.toISOString();
    // console.log("ahora_utc_iso: front ", ahora_utc_iso);
    // // 2024-03-11T14:05:03.959Z  (hora española actual: 15:06)

    // setmomento(ahora_utc_iso);
    // // console.log(momento);

    // const mensaje_titulo = `Modificando Registro: ${momento.toISOString()} - ${evento.target.elements.lugar_id.value}`;
    // setMensaje(mensaje_titulo);

    // changeEstadoProcesamiento('Registrar', 'procesando');

    let formData = new FormData();

    formData.append("momento", registro.momento);

    formData.append("lugar_id", registro.lugar_id);
    formData.append("pruebas", pruebas ? '1' : '0');

    const campos_modificables = ["texto", "que_tal_olas", "que_tal_yo", "numero_olas", "gente"];
    campos_modificables.map((campo) => {
        formData.append(campo, registro[campo])
    });

    // if (adjuntos && adjuntos.length !== 0) {
    //     setMensaje(mensaje_titulo + `<br> + insertando adjuntos...`);

    //     addProcesamiento('Insertar Adjuntos');
    //     changeEstadoProcesamiento('Insertar Adjuntos', 'procesando');

    //     await Promise.all(adjuntos.map(async (adjunto, index) => {
    //         let tipo = "desconocido";
    //         // console.log("Adjunto: ");
    //         // console.log(adjunto);
    //         let ahora = new Date()
    //             .toISOString()
    //             .slice(0, 19)
    //             // .r1eplace("T", " ")
    //             .replace(/:/g, "_");

    //         const extension = adjunto.archivo.name.split(".");

    //         const nombre_archivo =
    //             ahora +
    //             "-" +
    //             String(evento.target.elements.lugar_id.value).padStart(3, "0") +
    //             "-" +
    //             nanoid().substring(1, 5) +
    //             "." +
    //             extension.pop();

    //         console.log(
    //             "\x1b[38;5;214m%s\x1b[0m",
    //             "nombrearchivo: " + nombre_archivo
    //         );

    //         const ruta = pruebas ? ruta_archivos_registros_pruebas + nombre_archivo : ruta_archivos_registros + nombre_archivo;
    //         switch (true) {
    //             case adjunto.tipo.includes("image"):
    //                 console.log("Gestionando foto " + ruta);
    //                 tipo = "fotos";
    //                 break;
    //             case adjunto.tipo.includes("video"):
    //                 console.log("Gestionando video " + ruta);
    //                 tipo = "videos";
    //                 break;
    //             default:
    //                 console.log("Subida abortada: Tipo de archivo desconocido");
    //                 tipo = "desconocido";
    //                 break;
    //         }
    //         setMensaje(mensaje_titulo + `<br> + insertando adjunto: ${ruta}`);
    //         try {
    //             await uploadToS3(adjunto.archivo, ruta);
    //             formData.append(tipo, ruta);
    //         } catch {
    //             console.log("Error subiendo el archivo: " + ruta)
    //         }
    //     }));
    //     changeEstadoProcesamiento('Insertar Adjuntos', 'finalizado correcto');
    // }
    console.log("formData datos a enviar >>>>>>>");
    console.log(formData);

    // changeEstadoProcesamiento('Modificar Registro', 'procesando');
    // changeEstadoProcesamiento('Recopilar datos de APIs', 'procesando');

    if (CamposValidos) {
        await peticionServidor(formData);
    }

    // changeEstadoProcesamiento('Recopilar datos de APIs', 'finalizado correcto');
    // changeEstadoProcesamiento('Modificar Registro', 'finalizado correcto');

    // changeEstadoProcesamiento('Registrar', 'finalizado correcto');

    // setMensaje(mensaje);

}

export default ModifyRegistro;