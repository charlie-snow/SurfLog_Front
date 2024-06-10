import { useEffect, useRef } from "react";

const LugarMdatos = ({ lugar_mdatos }) => {

  const marco_bolaola_ref = useRef(null);
  const flecha_marea = useRef(null);
  const flecha_viento = useRef(null);

  const direcciones = [
    { label: "N", range: [0, 22.5], color: "blue" },
    { label: "NE", range: [22.5, 67.5], color: "#007f7f" },
    { label: "E", range: [67.5, 112.5], color: "green" },
    { label: "SE", range: [112.5, 157.5], color: "#7f7f00" },
    { label: "S", range: [157.5, 202.5], color: "red" },
    { label: "SW", range: [202.5, 247.5], color: "#ff6000" },
    { label: "W", range: [247.5, 292.5], color: "orange" },
    { label: "NW", range: [292.5, 337.5], color: "#7f607f" },
    { label: "N", range: [337.5, 360], color: "blue" },
  ];

  useEffect(() => {
    bolaflechar(lugar_mdatos.altura_ola, lugar_mdatos.direccion_ola);
    direccionarFlecha(lugar_mdatos.direccion_viento, flecha_viento.current);
    const direccion = lugar_mdatos.subiendo_marea === 1 ? (180) : (0);
    direccionarFlecha(direccion, flecha_marea.current);
  }, [lugar_mdatos])

  // const renderParams = () => {
  //   return Object.keys(lugar_mdatos).map((key, index) => {
  //     const value = lugar_mdatos[key];
  //     if (value !== null && value !== "") {
  //       return (
  //         <div key={index} className="bg-gray-200 p-2 mb-2">
  //           <strong>{key}:</strong> {value}
  //         </div>
  //       );
  //     }
  //     return null;
  //   });
  // };

  const grados_opuestos = (grados) => {
    grados += 180;
    if (grados >= 360) {
      grados -= 360;
    }
    return grados;
  };

  function bolaflechar(altura_ola, direccion_ola) {

    const direcciones = [
      { label: "N", range: [0, 22.5], color: "blue" },
      { label: "NE", range: [22.5, 67.5], color: "#007f7f" },
      { label: "E", range: [67.5, 112.5], color: "green" },
      { label: "SE", range: [112.5, 157.5], color: "#7f7f00" },
      { label: "S", range: [157.5, 202.5], color: "red" },
      { label: "SW", range: [202.5, 247.5], color: "#ff6000" },
      { label: "W", range: [247.5, 292.5], color: "orange" },
      { label: "NW", range: [292.5, 337.5], color: "#7f607f" },
      { label: "N", range: [337.5, 360], color: "blue" },
    ];

    const grados_opuestos = (grados) => {
      grados += 180;
      if (grados >= 360) {
        grados -= 360;
      }
      return grados;
    };

    if (marco_bolaola_ref.current) {
      const marco_bolaola = marco_bolaola_ref.current;
      const context = marco_bolaola.getContext("2d");
      const degrees = direccion_ola;

      let color = "blue";
      // Find the cardinal direction for the given degrees
      for (const direction of direcciones) {
        if (degrees >= direction.range[0] && degrees < direction.range[1]) {
          color = direction.color;
        }
      }

      direccion_ola = grados_opuestos(direccion_ola);

      // Set canvas width and height explicitly
      marco_bolaola.width = 60;
      marco_bolaola.height = 60;

      // Clear the canvas context
      context.clearRect(0, 0, 60, 60);

      const centerX = marco_bolaola.width / 2;
      const centerY = marco_bolaola.height / 2;

      // Draw the circle
      const radius = 22; // Adjust the radius as needed
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();

      // Draw the arrow
      const arrowLength = radius / 2; // Adjust the arrow length as needed
      const angle = ((90 - direccion_ola) * Math.PI) / 180; // Convert angle to radians
      const arrowX = centerX + Math.cos(angle) * (radius + arrowLength);
      const arrowY = centerY - Math.sin(angle) * (radius + arrowLength);

      // Draw the arrowhead
      const arrowheadSize = 30;
      const arrowheadAngle = Math.PI / 6; // 30 degrees in radians
      const arrowheadX =
        arrowX - Math.cos(angle + arrowheadAngle) * arrowheadSize;
      const arrowheadY =
        arrowY + Math.sin(angle + arrowheadAngle) * arrowheadSize;
      context.fillStyle = color;

      context.beginPath();
      context.moveTo(arrowX, arrowY);
      context.lineTo(arrowheadX, arrowheadY);
      context.lineTo(
        arrowX - Math.cos(angle - arrowheadAngle) * arrowheadSize,
        arrowY + Math.sin(angle - arrowheadAngle) * arrowheadSize
      );
      context.closePath();
      context.fillStyle = color;
      context.fill();

      // Draw the number
      context.font = "bold 18px Arial";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(altura_ola, centerX, centerY);
    }

  }

  function direccionarFlecha(direccion, flecha) {
    if (flecha) {
      flecha.style.transform =
        "rotate(" + grados_opuestos(direccion) + "deg)";
    }
  }

  return (
    <>
      <div>
        <div className="text-xl font-semibold">
          Estado del mar
        </div>
        <div className="flex flex-wrap gap-2">
          {(lugar_mdatos.altura_ola || lugar_mdatos.periodo_ola || lugar_mdatos.direccion_ola || lugar_mdatos.punto_marea || lugar_mdatos.subiendo_marea || lugar_mdatos.temperatura_agua) && (
            <div className="bg-blue-200 border-2 border-stone-900 flex items-center h-16">
              <div className="text-l font-bold transform -rotate-90">Oleaje</div>
              {/* <img src="/imagenes/ola_redondo.png" style={{ width: '45px' }} />  */}
              <div>
                <canvas ref={marco_bolaola_ref} />
              </div>
              <div className="text-s font-bold w-16 ml-4">Altura de ola</div>
              <div className="p-2 ml-2">
                <div className="text-gray-500 flex">
                  <div className="text-2xl font-bold">{lugar_mdatos.periodo_ola}</div>
                  <div className="text-l"> s</div>
                </div>
                <div className="text-l font-bold">Período</div>
              </div>
            </div>

          )}

          {lugar_mdatos.temperatura_agua && (
            <div className="bg-blue-200 border-2 border-stone-900 flex items-center h-16">
              <div className="p-2 ml-2">
                <div className="text-gray-500 flex">
                  <div className="text-2xl font-bold">{lugar_mdatos.temperatura_agua}</div>
                  <div className="text-l">ºC</div>
                </div>
                <div className="text-l font-bold">Temperatura</div>
              </div>
            </div>
          )}

          {lugar_mdatos.punto_marea && (
            <div className="bg-blue-200 border-2 border-stone-900 flex items-center h-16">
              <div className="text-l font-bold transform -rotate-90">Marea</div>

              <div className="p-2 ml-2">
                <div className="text-gray-500 text-2xl font-bold">{lugar_mdatos.punto_marea}</div>
                <div className="text-l font-bold">Punto</div>
              </div>
              <div className="p-2">
                <img
                  src="/imagenes/flecha_marea.png"
                  ref={flecha_marea}
                  style={{ width: "2.3rem", height: "2.3rem" }}
                />
              </div>
              {/* <div className="text-s" width="70px">

{props.datos.marea_actual.puntos_marea.map((marea, index) => {
let marea_prox = "";
if (marea.marea == "pleamar") { marea_prox = "Plea" } else { marea_prox = "Baja" }
const hora =
  marea.fecha_marea.getHours().toString().padStart(2, "0") +
  ":" +
  marea.fecha_marea
    .getMinutes()
    .toString()
    .padStart(2, "0");
if (hora === props.datos.marea_actual.hora) {
  return (marea_prox + ":   " + hora)
}
})}
</div> */}
            </div >
          )}
        </div >

        <div className="text-xl font-semibold">
          Estado del tiempo atmosférico
        </div>
        <div className="flex flex-wrap gap-2">
          {(lugar_mdatos.velocidad_viento || lugar_mdatos.direccion_viento || lugar_mdatos.temperatura_ambiente || lugar_mdatos.lluvia || lugar_mdatos.nubes) && (
            <div>

              <div className="bg-blue-200 border-2 border-stone-900 flex items-center h-16">
                <div className="text-l font-bold transform -rotate-90">Viento</div>
                <div className="p-2">
                  <img
                    src="/imagenes/flecha_viento.png"
                    ref={flecha_viento}
                    style={{ width: "40px" }}
                  />
                </div>
                <div className="text-gray-500 flex mr-2">
                  <div className="text-2xl font-bold">{lugar_mdatos.velocidad_viento}</div>
                  <div className="text-l">Km/h</div>
                </div>
              </div>
            </div>

          )}
          {lugar_mdatos.temperatura_ambiente && (

            <div className="bg-blue-200 border-2 border-stone-900 flex items-center h-16">
              <div className="p-2 ml-2">
                <div className="text-gray-500 flex">
                  <div className="text-2xl font-bold">{lugar_mdatos.temperatura_ambiente}</div>
                  <div className="text-l">ºC</div>
                </div>
                <div className="text-l font-bold">Temperatura</div>
              </div>
            </div>
          )}
        </div>
      </div >


      {/* <div className="bg-gray-200 p-4 flex flex-col">
        <div className="bg-blue-200 p-2 ">
          {renderParams()}
        </div>
      </div> */}
    </>
  );
};

export default LugarMdatos;
