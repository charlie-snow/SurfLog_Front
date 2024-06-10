import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { ContextoPersonal } from "./contexts/ContextoPersonal";

import { Layout } from "./components/style/Layout";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import RegistrosPage from "./pages/RegistrosPage";
import LugaresPage from "./pages/LugaresPage";
import InsertarRegistro from "./pages/InsertarRegistro";
import ModificarRegistroPage from "./pages/ModificarRegistroPage";
import { useState } from "react";
import LugarPage from "./pages/LugarPage";
// import Camara from "./components/Camara";
// import WebcamStreamCapture from "./components/WebcamStreamCapture";
// import volcadoImagenes from "./components/registros/volcadoImagenes";
// import pruebaS3React from "../pruebaS3React.jsx";

const App = () => {
  const [admin, setAdmin] = useState(false);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <PaginaPrincipal />,
        },
        {
          path: "/registros",
          element: <RegistrosPage pruebas={false} />,
        },
        {
          path: "/registros/pruebas",
          element: <RegistrosPage pruebas={true} />,
        },
        {
          path: "/lugares",
          element: <LugaresPage />,
        },
        {
          path: "/lugar/:id",
          element: <LugarPage />,
        },
        {
          path: "/registro/insertar",
          element: <InsertarRegistro />,
        },
        {
          path: "/registro/:id/modificar",
          element: <ModificarRegistroPage pruebas={false} />,
        },
        {
          path: "/registro/:id/modificar/pruebas",
          element: <ModificarRegistroPage pruebas={true} />,
        },
        // {
        //   path: "/prueba",
        //   element: <pruebaS3React />,
        // },
        // {
        //   path: "/imagenes",
        //   element: <volcadoImagenes />,
        // },
        // {
        //   path: "/user/experiences/:exp_id",
        //   element: <SingleExperience />,
        // },
        // {
        //   path: "/compose/experience",
        //   element: <CreateExperience />,
        // },
        // {
        //   path: "/login",
        //   element: <LoginPage />,
        // },
        // {
        //   path: "/register",
        //   element: <RegisterPage />,
        // },

        // {
        //   path: "/user/settings",
        //   element: <ModUser />,
        // },
        // {
        //   path: "/user/experience/:exp_id/settings",
        //   element: <ModExp />,
        // },
        // {
        //   path: "/user/experiences",
        //   element: <MyExperiences />,
        // },
      ],
    },
  ]);

  return (
    <ContextoPersonal.Provider
      value={{
        admin_estado: [admin, setAdmin]
      }}>
      {/* <AuthProvider>
      <SearchProvider>
        <ReloadProvider> */}
      <RouterProvider router={router} />
      {/* </ReloadProvider>
      </SearchProvider>
    </AuthProvider> */}
    </ContextoPersonal.Provider>
  );
};

export default App;
