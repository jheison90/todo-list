import React, { useState, useEffect } from 'react'
import Paginaginacion from './Pagination/Pagination';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { Toast, ToastContainer, Row, Col, Button, InputGroup, FormControl, Container, Modal } from 'react-bootstrap';
import { AuthContext } from '../../../Home';

/**
 * Importar componentes propios
 */
import './tarea.css';
import Descripcion from './Descripcion/Descripcion';
import { URL } from '../../../Config/Server';
/**Estado inicial del componente */
const initialState = {
    tareaSeleccionadaId: 0,
    tareaSeleccionada: {},
    tareas: []
}

function Tareas(props) {

    const [data, setData] = React.useState(initialState);
    const { dispatch, state } = React.useContext(AuthContext);
    const { categoriaSeleccionada, categoriaSeleccionadaId, buscarCategorias } = props;
    const [selected, setSelected] = React.useState([]);
    const [show, setShow] = React.useState(false);
    const [showCrearTarea, setShowCrearTarea] = React.useState(false);
    const [showToast, setShowToast] = useState(false);
    const [tipoToast, setTipoToast] = useState('success');
    const [mostrarMensaje, setMostrarMensaje] = useState('');
    const [mostrarPanelDescripcion, setMostrarPanelDescripcion] = React.useState(false);
    const [nombreTarea, setNombreTarea] = React.useState('');
    const [myRef, setMyRef] = React.useState(React.createRef());

    const usuario = JSON.parse(state.user);
    /**
     * Paginación componente de terceros
     * */
    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 5;
    const offset = currentPage * PER_PAGE;

    const currentPageData = data.tareas
        .slice(offset, offset + PER_PAGE)
        .map(({ thumburl }) => <img src={thumburl} />);

    const pageCount = Math.ceil(data.tareas.length / PER_PAGE);

    //Fin Paginación


    //Ejecutarse despues de renderizarse
    useEffect(() => {


        /**
         * Obtiene una lista de tareas relacionadas a la categoria seleccionada
         */
        buscarTareas();

    }, []);


    //Se ejecuta cuando se cambia de categoria
    useEffect(() => {

        setMostrarPanelDescripcion(false);

        if (categoriaSeleccionadaId == 0) {
            buscarTareasFinalizadas();

        } else {



            axios.get(URL + 'categoria/' + categoriaSeleccionadaId + '/tarea',
                {
                    headers: { Authorization: 'Bearer ' + JSON.parse(state.token) }
                })
                .then((res) => {

                    setData({
                        ...data,
                        tareas: res.data
                    });
                    setMostrarPanelDescripcion(false);

                    if (categoriaSeleccionadaId > 0) {
                        window.scrollTo(0, myRef.current.offsetTop * 10);
                    }



                })
                .catch((err) => {
                    console.log(err)
                })
        }

    }, [categoriaSeleccionadaId]);

    /**
     * Buscar las tareas relacionadas a la categoria seleccionada
     */
    function buscarTareas() {

        axios.get(URL + 'categoria/' + categoriaSeleccionadaId + '/tarea',
            {
                headers: { Authorization: 'Bearer ' + JSON.parse(state.token) }
            })
            .then((res) => {

                buscarCategorias();
                setData({
                    ...data,
                    tareas: res.data
                });
                handleClose();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    /**
    * Buscar las tareas relacionadas a la categoria seleccionada
    */
    function buscarTareasFinalizadas() {
        axios.get(URL + 'usuario/'+usuario.id+'/tarea/finalizado',
            {
                headers: { Authorization: 'Bearer ' + JSON.parse(state.token) }
            })
            .then((res) => {

                buscarCategorias();
                setData({
                    ...data,
                    tareas: res.data
                });
                handleClose();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    //Actualiza la className de los elementos
    const grupoClases = (tareaId) => {

        if (data.tareaSeleccionadaId === tareaId) {
            return 'list-group-item list-group-item-action mb-1 active';
        } else {
            return 'list-group-item list-group-item-action mb-1';
        }
    }

    /**
     * 
     * Almacena los datos de la tarea seleccionada y mostras sus detalles
     */
    function handleTareaSeleccionada(tareaId, tarea) {

        setData({
            ...data,
            tareaSeleccionadaId: tareaId,
            tareaSeleccionada: tarea
        });
        setMostrarPanelDescripcion(true);
        setShow(true);
    }

    /**
     * 
     * Actualizar el valor de los inputs
     */

    function onChangeValue(e) {
        e.preventDefault();
        setNombreTarea(e.target.value);

    }




    function onClickNuevaTarea(e) {

        e.preventDefault();



        if (categoriaSeleccionadaId == 0) {

            setMostrarMensaje('No se puede guardar una tarea en esta categoria');
            setTipoToast('warning');
            setShowToast(true); // mostrar mensaje de resultado
            handleClose();
            window.scrollTo(0, 0);
            return;

        }



        let usuario = JSON.parse(state.user)

        axios.post(URL + 'categoria/' + categoriaSeleccionadaId + '/tarea',
            {

                nombre: nombreTarea,
                categoria_id: categoriaSeleccionadaId,
                usuario_id: usuario.id

            },
            {
                headers: { Authorization: 'Bearer ' + JSON.parse(state.token) }

            },
        )
            .then((res) => {


                setNombreTarea('');
                buscarTareas(); //actualizar la lista de tareas
                setMostrarMensaje('Tarea Guardada Exitosamente');
                setTipoToast('success');
                setShowToast(true); // mostrar mensaje de resultado
                setShowCrearTarea(false);
                window.scrollTo(0, 0);




            })
            .catch((err) => {
                console.log(err)
            })
    }


    /**
     * Mostrar panel de descripción cambiando su className
     */

    const mostrarDescripcion = () => {

        if (mostrarPanelDescripcion) {
            return 'd-none d-md-block col-md-5 col-12 descripcion';
        } else {
            return 'd-none';
        }

    }

    /**
     * Buscar tarea
     */

    const listaTareas =

        data.tareas.map(element => {
            return <a

                key={element.id}
                className={grupoClases(element.id)}
                aria-current="true"
                onClick={() => handleTareaSeleccionada(element.id, element)}>
                <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{element.nombre}</h5>
                    <small>3 days ago</small>
                </div>
                <p className="mb-1">{element.descripcion ? element.descripcion : 'Agrega una descripción'}.</p>
            </a>
        })



    /**
     * 
     * Ir a la tarea especifica cuando se selecciona en el campo de autocompletar y
     * mostrar los detalles
     */
    function seleccionarTareaBuscar(datoSeleccionado) {

        handleTareaSeleccionada(tarea.id, tarea);

    }

    /**
     * Cerrar el modal 
     */
    function handleClose() {
        setShow(false);
        setShowCrearTarea(false);
    }

    /**
     * Mostrar notificación
     */

    function mostrarNotificacion(mensaje, tipo) {

        if (tipo === 'success') setMostrarPanelDescripcion(false);
        setMostrarMensaje(mensaje);
        setTipoToast(tipo);
        setShowToast(true); // mostrar mensaje de resultado
        window.scrollTo(0, 0);

    }






    return (
        <Container ref={myRef} className="p-0 p-md-1">

            <Row>
                <Col xs={6}>
                    <ToastContainer position="top-end" className="p-3">
                        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                            <Toast.Header>
                                <strong className="me-auto">Acción</strong>
                            </Toast.Header>
                            <Toast.Body className={`bg-${tipoToast === 'success' ? tipoToast + ' text-white' : tipoToast} `}>{mostrarMensaje}</Toast.Body>
                        </Toast>
                    </ToastContainer>
                </Col>
            </Row>

            <div className="row">

                <div className={mostrarPanelDescripcion ? "list-group col-md-7 col-12 mb-2 px-3" : "list-group col-12 mb-2 px-3"}>
                    <Typeahead
                        id="basic"
                        onChange={seleccionarTareaBuscar}
                        labelKey='nombre'
                        options={data.tareas}
                        placeholder="Busca una tarea"
                        selected={selected}
                    />
                </div>

                <div className={mostrarPanelDescripcion ? "list-group col-md-7 col-12 px-3 px-0-md" : "list-group col-12 px-3 px-0-md"}>
                    <Paginaginacion itemsPerPage={5} tareas={data.tareas} grupoClases={grupoClases} tareaSeleccionada={handleTareaSeleccionada} />
                </div>

                <div className={mostrarDescripcion()}>
                    {mostrarPanelDescripcion ? <Descripcion mostrarNotificacion={mostrarNotificacion} tareaSeleccionada={data.tareaSeleccionada} buscarTareas={buscarTareas} /> : ''}
                </div>



                <Modal className="d-md-none" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        {mostrarPanelDescripcion ? <Descripcion mostrarNotificacion={mostrarNotificacion} tareaSeleccionada={data.tareaSeleccionada} buscarTareas={buscarTareas} /> : ''}
                    </Modal.Body>
                </Modal>

                <div className={mostrarPanelDescripcion ? "col-md-7 col-12 d-none d-md-block" : "col-12 d-none d-md-block"}>
                    <InputGroup size="md" className="mt-3">
                        <FormControl
                            placeholder={!categoriaSeleccionada || categoriaSeleccionada === 'Finalizados'? 'Seleccione una categoria' : `Agregar nueva tarea en ${categoriaSeleccionada}`}
                            aria-label="Agregar nueva tarea"
                            aria-describedby="basic-addon2"
                            onChange={onChangeValue}
                            value={nombreTarea}
                            name="nombreTarea"
                        />
                        <Button onClick={onClickNuevaTarea} className="btn btn-primary" id="button-addon2">
                            Agregar
                        </Button>
                    </InputGroup>
                </div>

            </div>

            <Modal className="d-md-none" show={showCrearTarea} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nueva Tarea</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <InputGroup size="md" className="mt-3">
                        <FormControl
                            placeholder={!categoriaSeleccionada || categoriaSeleccionada === 'Finalizados'? 'Seleccione una categoria' : `Agregar nueva tarea en ${categoriaSeleccionada}`}
                            aria-label="Agregar nueva tarea"
                            aria-describedby="basic-addon2"
                            onChange={onChangeValue}
                            value={nombreTarea}
                            name="nombreTarea"
                        />
                        <Button onClick={onClickNuevaTarea} className="btn btn-primary" id="button-addon2">
                            Agregar
                        </Button>
                    </InputGroup>
                </Modal.Body>
            </Modal>
            <a onClick={() => setShowCrearTarea(true)} className="float d-md-none">
                {/* <i className="fa fa-plus my-float">+</i> */}
                <PlusCircleFill className="my-float" color="royalblue" size={50} />
            </a>


        </Container>

    )
}

export default Tareas;