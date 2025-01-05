import React from "react";

const NewBudget = () => {

    const handlePrint = () => {
        window.print();
    };

    return(
        <div>
            <div id="printable-section">
                Presupuesto
            </div>
            <button onClick={handlePrint}>Imprimir</button>
        </div>

    )
};

export default NewBudget;