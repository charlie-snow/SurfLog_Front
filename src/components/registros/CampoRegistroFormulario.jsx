const CampoRegistroFormulario = ({ campo, valor, valor_modificado, handleChange }) => {
    return (
        <div key={campo} className="mb-2">
            <div className="flex">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{campo.replace(/_/g, ' ')}</label>
                    <input
                        type="text"
                        name={campo}
                        value={valor_modificado}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md"
                    // className="mt-1 p-1 border rounded-md w-full"
                    />
                </div>
                <div className="text-center max-w-16 max-h-12 overflow-auto">
                    <div>original</div>
                    <div>{valor}</div>
                </div>
            </div>
        </div>
    );
}

export default CampoRegistroFormulario;
