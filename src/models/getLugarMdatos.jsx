// por ahora sólo recoge los mdatos del lugar en el momento actual

const getLugarMdatos = async (id) => {
  try {
    const ahora_utc = new Date();
    const momento = ahora_utc.toISOString();
    console.log("momento: " + momento)

    let formData = new FormData();
    formData.append("momento", momento);
    const result = await fetch(
      `${import.meta.env.VITE_REACT_HOST}/lugar/mdatos/` + id,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!result.ok) {
      throw new Error(`Error: ${result.status} - ${result.statusText}`);
    }
    const res = await result.json();
    return res.data.mdatos;

  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default getLugarMdatos;
