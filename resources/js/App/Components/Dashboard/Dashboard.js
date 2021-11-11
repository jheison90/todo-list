import { AuthContext } from '../../Home';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Card, ListGroup, ListGroupItem, Row, Col, Container, Button, InputGroup, FormControl } from 'react-bootstrap';

/**
 * Importar componentes propios
 */
import Tareas from './Tareas/Tareas'
import './dashboard.css';
import { URL } from '../../Config/Server';
/**
 * Estado Inicial del componente
 */
const initialState = {
    categoriaSeleccionada: '',
    categoriaSeleccionadaId: -1,       
    categorias: []
}


function Dashboard() {

    const [data, setData] = React.useState(initialState);
    const [crearCategoria, setCrearCategoria] = React.useState(false);
    const [nombreCategoria, setNombreCategoria] = React.useState('');
    const { dispatch, state } = React.useContext(AuthContext);

    /**
     * Datos de usuario
     */
    const usuario = JSON.parse(state.user);

    /**
     * Este hook se ejecuta despues de la renderizada
     */

    useEffect(() => {


        /**
         * Obtiene la lista de categorias asociadas al usuario,
         * 
         */

        buscarCategorias();

    }, []);



    /**
     * Busca las categorias relacionadas a un usuario
     */
    function buscarCategorias() {

        axios.get(URL + 'usuario/' + usuario.id + '/categoria',
            {
                headers: { Authorization: 'Bearer ' + JSON.parse(state.token) }
            })
            .then((res) => {

                setData({
                    ...data,
                    categorias: res.data
                });
            })
            .catch((err) => {
                console.log(err)
            })

    }

    /**
     * Captura los datos de la categoria seleccionada
     */
    function onClickCategoriaSeleccionada(nombreCategoria, id) {

        setData({
            ...data,
            categoriaSeleccionada: nombreCategoria,
            categoriaSeleccionadaId: id,
        });

    }



    /**
     * Asigna un className para resaltar tareas seleccionadas
     */
    const listaClase = (view) => {

        if (data.categoriaSeleccionada === view) {
            return 'list-group list-group-active rounded-0';
        } else {
            return 'list-group rounded-0';
        }
    }


    /**
     * 
     * Captura el valor del input
     */
    function onChangeValue(e) {
        e.preventDefault();
        console.log(nombreCategoria)
        console.log(e.target.value)
        setNombreCategoria(e.target.value);        
    }


    /**
     * Mostrar el formulario para crear una nueva categoria
     */
    function mostrarFomularioNuevaCategoria() {
        setCrearCategoria(true);
    }

    /**
     * Crear una nueva cateroria
     */

    function crearNuevaCategoria() {

        axios.post(URL + 'usuario/' + usuario.id + '/categoria',
            {
                nombre: nombreCategoria,
                usuario_id: usuario.id
            },
            {
                headers: { Authorization: 'Bearer ' + JSON.parse(state.token) }
            })
            .then((res) => {

                buscarCategorias(); //Actualiza la lista de categorias
                setNombreCategoria(''); 
                setCrearCategoria(false);
            })
            .catch((err) => {
                console.log(err)
            })

    }


    /**
     * Retorna un componente ListGroup que representa la lista de categorias
     */
    const listaCategorias = data.categorias.map((element) =>
        <ListGroupItem
            key={element.id}
            className={listaClase(element.nombre)}
            onClick={() => onClickCategoriaSeleccionada(element.nombre, element.id)}>
            <div className="d-flex justify-content-between">
                {element.nombre}
                <span className="badge bg-secondary">{element.total_tareas}</span>
            </div>
        </ListGroupItem>
    );

    /**
     * Retorna un componente Tareas
     */

    const listaTareasComponent = () => {
        return <Tareas
            categoriaSeleccionada={data.categoriaSeleccionada}
            categoriaSeleccionadaId={data.categoriaSeleccionadaId}
            buscarCategorias={buscarCategorias} />
    }

    return (
        <Container className="p-1 p-md-5">
            <Row>
                <Col className="mb-3" md={3}>
                    <Card className="profile-menu shadow-lg">
                        <Card.Body>
                            <Card.Title className="text-center">{usuario.nombre}</Card.Title>
                        </Card.Body>

                        <ListGroup className="list-group-flush">
                            <ListGroupItem className="text-center bg-light">Mis Categorias</ListGroupItem>
                            {listaCategorias}
                        </ListGroup>
                        <Card.Body className="text-center" >
                            {crearCategoria ?
                                <div>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder="Nombre Categoria"
                                            aria-label="Nombre Categoria"
                                            aria-describedby="basic-addon2"
                                            onChange={onChangeValue}
                                            value={nombreCategoria}
                                            name='nombreCategoria'
                                        />
                                        <Button onClick={crearNuevaCategoria} variant="outline-secondary" id="button-addon2">
                                            Crear
                                        </Button>
                                    </InputGroup>
                                </div>
                                : <Button onClick={mostrarFomularioNuevaCategoria} variant="outline-primary">Nueva Categoria</Button>}

                        </Card.Body>
                    </Card>
                </Col>
                <Col md={9}>
                    {listaTareasComponent()}
                </Col>
            </Row>
        </Container>

    );
}

export default Dashboard;
