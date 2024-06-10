import loadIcon from "/img/wave_peq.gif";
import { useEffect, useState } from "react";
import { ContextoPersonal } from "../contexts/ContextoPersonal";
import React, { useContext } from "react";
import getLugar from "../models/getLugar";
import Lugar from "../components/lugares/Lugar";
import { useParams } from 'react-router-dom';
import LugarMdatos from "../components/lugares/LugarMdatos";
import getLugarMdatos from "../models/getLugarMdatos.jsx";

const LugarPage = () => {

  let { id } = useParams();

  // const { admin_estado } = useContext(ContextoPersonal);
  // const [admin, setAdmin] = admin_estado;

  const [lugar, setLugar] = useState(null);
  const [lugar_mdatos, setLugar_mdatos] = useState(null);

  useEffect(() => {
    const recogerLugar = async () => {
      try {
        setLugar(null);
        const data = await getLugar(id);
        setLugar(data);
        setLugar_mdatos(null);
        const data_mdatos = await getLugarMdatos(id);
        setLugar_mdatos(data_mdatos);
      } catch (error) {
        console.error(error.message);
      }
    };
    recogerLugar();
  }, []);

  return (
    <div className="items-center bg-fixed bg-cover p-3">
      <div>
        {!lugar ? (
          <div className="flex flex-col items-center justify-center">
            {/* <img className="h-40 w-40 rounded-full" src={loadIcon} alt="Loading Icon"></img> */}
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center h-full">
              <ul>
                <Lugar lugar={lugar} />
              </ul>
            </div>
          </>
        )}
      </div>
      <div>
        {!lugar_mdatos ? (
          <div className="flex flex-col items-center justify-center">
            <img className="h-40 w-40 rounded-full" src={loadIcon} alt="Loading Icon"></img>
            Obteniendo datos meteorológicos externos
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center h-full">
              <ul>
                <LugarMdatos lugar_mdatos={lugar_mdatos} />
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LugarPage;
