const getRegistro = async (registro_id, pruebas) => {
  try {
    let ruta = "/registro";
    ruta += "/" + registro_id;
    if (pruebas) {
      ruta = ruta + "?pruebas=true";
    }
    console.log(ruta)
    const result = await fetch(import.meta.env.VITE_REACT_HOST + ruta);

    if (!result.ok) {
      throw new Error(`Error: ${result.status} - ${result.statusText}`);
    }
    const res = await result.json();
    // console.log("Resultados registros: ");
    // console.log(res);

    return res.data;
  } catch (error) {
    console.error("Error recuperando registro: " + error.message);
    throw error;
  }
};

export default getRegistro;
