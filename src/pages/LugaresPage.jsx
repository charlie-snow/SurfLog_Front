
import LugaresLista from "../components/lugares/LugaresLista";
import useLugares from "../hooks/useLugares";
import loadIcon from "/img/wave_peq.gif";

const Lugares = () => {

  const { lugares } = useLugares();

  return (
    <div className="h-full w-full flex flex-col items-center bg-fixed bg-cover m-2">
      {!lugares ? (
        <div className="flex flex-col items-center justify-center">
          <img className="h-40 w-40 rounded-full" src={loadIcon} alt="Loading Icon"></img>
          <p>Obteniendo lista de lugares</p>
        </div>
      ) : (
        <>
          <p>Lugares</p>
          <div className="flex flex-col justify-center h-full">
            {lugares.length === 0 ? (
              <div className="flex flex-col p-6 rounded-xl items-center gap-4 bg-white w-fit">
                <p>No hay lugares.</p>
              </div>
            ) : (
              <ul class="flex flex-wrap">
                <LugaresLista lugares={lugares} />
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Lugares;
