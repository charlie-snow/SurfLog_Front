import React from 'react'
import { useState } from "react";
import InsertarRegistroFormulario from "../components/registros/InsertarRegistroFormulario";

const InsertarRegistro = () => {
    const [pruebas, setPruebas] = useState(false);

    return (
        <div className="mt-4">
            <div className="flex flex-col">
                <InsertarRegistroFormulario pruebas={pruebas} setPruebas={setPruebas} />
            </div>
        </div>

    );

};

export default InsertarRegistro;
