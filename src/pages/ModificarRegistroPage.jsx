import React, { useEffect } from 'react'
import { useState } from "react";
import { useParams } from 'react-router-dom';

import ModifyRegistroFormulario from "../components/registros/ModifyRegistroFormulario";
import getRegistro from '../models/getRegistro';

const ModificarRegistroPage = ({ pruebas }) => {
    // const [pruebas, setPruebas] = useState(false);

    let { id } = useParams();
    console.log(id);
    const [registro, setRegistro] = useState(null);

    useEffect(() => {
        const recogerRegistro = async () => {
            try {
                setRegistro(null);
                const data = await getRegistro(id, pruebas);
                setRegistro(data);
            } catch (error) {
                console.error(error.message);
            }
        };
        recogerRegistro();
    }, [id]);

    return (
        <div className="mt-4">
            <div className="flex flex-col">
                {!registro ? (
                    <div className="flex flex-col items-center justify-center">
                        {/* <img className="h-40 w-40 rounded-full" src={loadIcon} alt="Loading Icon"></img> */}
                    </div>
                ) : (
                    <ModifyRegistroFormulario pruebas={pruebas} registro={registro} />
                    // <div>NO</div>
                )}
            </div>
        </div>

    );

};

export default ModificarRegistroPage;
