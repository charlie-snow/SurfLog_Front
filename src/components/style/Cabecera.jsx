import { NavLink } from "react-router-dom";
import { GrHomeRounded } from "react-icons/gr";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useContext, useState } from "react";
import { ContextoPersonal } from "../../contexts/ContextoPersonal";


export const Cabecera = () => {

  // const { admin_estado } = useContext(ContextoPersonal);
  // const [admin, setAdmin] = admin_estado;

  return (
    <div className=" text-black w-max p-2 flex text-sm">
      <NavLink to="/" className="mx-2 hover:font-bold">
        <img src="/img/lapis.png" className="object-contain h-6" />
      </NavLink>
      <NavLink to="/registros" className="mx-2 hover:font-bold">
        <b>REGISTROS</b>
      </NavLink>
      <NavLink to="/registros/pruebas" className="mx-2 hover:font-bold">
        <b>P</b>

      </NavLink>
      <NavLink to="/lugares" className="mx-2 hover:font-bold">

        <b>LUGARES</b>

      </NavLink>
      <NavLink to="/registro/insertar" className="mx-2 hover:font-bold">

        <b>REGISTRAR</b>

      </NavLink>
      {/* {user && (
        <NavLink to="/compose/experience" className="mx-2 hover:font-bold">
          <div className="flex gap-2">
            <HiOutlinePencilSquare />
            <p>CREAR EXPERIENCIA</p>
          </div>
        </NavLink>
      )} */}
    </div>
  )
};
