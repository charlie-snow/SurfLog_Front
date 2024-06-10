import Lugar from "./Lugar";

const LugaresLista = ({ lugares }) => {

  return lugares.map((lugar) => {
    return (
      <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 mb-4 p-3" key={lugar.id}>
        <Lugar lugar={lugar} />
      </li>
    );
  });
};

export default LugaresLista;
