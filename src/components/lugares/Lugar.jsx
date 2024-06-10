import { NavLink } from "react-router-dom";

const Lugar = ({ lugar }) => {

  return (
    <>
      <NavLink to={"/lugar/" + lugar.id} className="mx-2 hover:font-bold">
        <div class="bg-gray-200 rounded-lg overflow-hidden shadow-md">
          <div class="bg-blue-200 text-xl p-4">{lugar.nombre}</div>
          <div class="p-4">
            <img src={lugar.imagen} alt="Imagen" class="w-full" />
          </div>
        </div>
      </NavLink>

    </>
  );
};

export default Lugar;
