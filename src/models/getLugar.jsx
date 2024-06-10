const getLugar = async (id) => {
  try {
    const ahora_utc = new Date();
    const momento = ahora_utc.toISOString();
    console.log("momento: " + momento)

    let formData = new FormData();
    formData.append("momento", momento);
    const result = await fetch(
      `${import.meta.env.VITE_REACT_HOST}/lugar/` + id
    );

    // const result = await fetch(
    //   `${import.meta.env.VITE_REACT_HOST}/lugar/` + id
    // );
    if (!result.ok) {
      throw new Error(`Error: ${result.status} - ${result.statusText}`);
    }
    const res = await result.json();
    // console.log(res);
    return res.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default getLugar;
