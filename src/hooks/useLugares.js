import { useEffect, useState } from "react";
import getLugares from "../models/getLugares";

const useLugares = () => {
  const [lugares, setLugares] = useState([]);

  useEffect(() => {
    const recogerLugares = async () => {
      try {
        setLugares(null);
        const data = await getLugares();
        setLugares(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    recogerLugares();
  }, []);

  return { lugares };
};

export default useLugares;
