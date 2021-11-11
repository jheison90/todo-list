import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'

function Items({ currentItems, gruposSeleccion, tareaSeleccionada }) {

    const obtenerFecha = (fecha)=>{

        fecha = new Date(fecha);
        
        fecha = fecha.getDate() + '/' + (fecha.getMonth() + 1) +'/'+fecha.getFullYear();

        return fecha;
    }
    
    return (
        <div className="items mb-4">

            {currentItems && currentItems.map((element) => (
                <div>
                    <a
                        key={element.id}
                        className={gruposSeleccion(element.id)}
                        aria-current="true"
                        onClick={() => tareaSeleccionada(element.id, element)}
                    >
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{element.nombre}</h5>
                            <small>Creado el {obtenerFecha(element.created_at)}</small>
                        </div>
                        <p className="mb-1">{element.descripcion ? element.descripcion : 'Agrega una descripción'}.</p>
                    </a>
                </div>
            ))}
        </div>
    );
}

function PaginatedItems({ itemsPerPage, tareas, grupoClases, tareaSeleccionada }) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;

        setCurrentItems(tareas.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(tareas.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;

        setCurrentItems(tareas.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(tareas.length / itemsPerPage));
    }, [tareas]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = event.selected * itemsPerPage % tareas.length;

        setItemOffset(newOffset);
    };

    function gruposSeleccion(id) {
        return grupoClases(id);
        //return 'list-group-item list-group-item-action active';
    }

    return (
        <>
            <Items currentItems={currentItems} gruposSeleccion={gruposSeleccion} tareaSeleccionada={tareaSeleccionada} />


            <ReactPaginate
                className="pagination justify-content-center"
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />

        </>
    );
}

// Add a <div id="container"> to your HTML to see the componend rendered.
export default PaginatedItems;