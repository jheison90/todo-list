import React, { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from '../../../../Home';
import { Card, ListGroup, Row, Col, Form, Button } from 'react-bootstrap';
import { URL } from '../../../../Config/Server';
/**
 * estado inicial del componente
 */
const initialState = {
    nombre: '',
    descripcion: '',
    fecha_finalizacion: ''
}

const obtenerFecha = () => {

    let fecha = new Date();

    fecha = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();

    return fecha;
}

function Descripcion(props) {

    const [data, setData] = React.useState(initialState);
    const [startDate, setStartDate] = useState(new Date());
    const { mostrarNotificacion, tareaSeleccionada, buscarTareas } = props;
    const { dispatch, state } = React.useContext(AuthContext);

    
    
    //ejecutar despues de renderizarse
    useEffect(() => {
        

        setData({
            ...data,
            nombre: tareaSeleccionada.nombre,
            descripcion: tareaSeleccionada.descripcion,
            fecha_finalizacion: tareaSeleccionada.fecha_finalizacion
        });

        setStartDate(new Date(tareaSeleccionada.fecha_finalizacion ? tareaSeleccionada.fecha_finalizacion : null))

    }, []);

    //ejecutar despues de cambiar de tarea
    useEffect(() => {

        setData({
            ...data,
            nombre: tareaSeleccionada.nombre,
            descripcion: tareaSeleccionada.descripcion,
            fecha_finalizacion: tareaSeleccionada.fecha_finalizacion
        });

        setStartDate(new Date(tareaSeleccionada.fecha_finalizacion ? tareaSeleccionada.fecha_finalizacion : null))

    }, [tareaSeleccionada]);


    //ejecutar despues de cambiar de fecha
    useEffect(() => {

        setData({
            ...data,
            nombre: tareaSeleccionada.nombre,
            descripcion: tareaSeleccionada.descripcion,
            fecha_finalizacion: startDate
        });


    }, [startDate]);

    /**
     * 
     * Actualiza los valores de los inputs
     */
    function onChangeValue(e) {
        e.preventDefault();
        setData({
            ...data,
            [e.target.name]: e.target.value,
            fecha_finalizacion: startDate
        });
    }

    /**
     * Actualiza la información de una tarea
     */
    function actualizarTarea() {

        axios.put(URL + 'tarea/' + tareaSeleccionada.id,
            {

                nombre: data.nombre,
                descripcion: data.descripcion,
                fecha_finalizacion: data.fecha_finalizacion

            },
            {
                headers: { Authorization: 'Bearer ' + JSON.parse(state.token) }

            },
        )
            .then((res) => {
                mostrarNotificacion('Tarea actualizada exitosamente', 'success');
                buscarTareas();

            })
            .catch((err) => {
                mostrarNotificacion('Error al actualizar', 'warning')
                console.log(err)
            })

    }

    /**
     * Finaliza una tarea
     */

    function finalizarTarea() {

        axios.put(URL + 'tarea/' + tareaSeleccionada.id + '/finalizar', {},
            {
                headers: { Authorization: 'Bearer ' + JSON.parse(state.token) }
            }
        )
            .then((res) => {
                mostrarNotificacion('Tarea Finalizada exitosamente', 'success')
                buscarTareas(); //actualizar lista de tareas
            })
            .catch((err) => {
                mostrarNotificacion('Error al finalizar', 'warning')
                console.log(err)
            })
    }

    /**
     * Eliminar una tarea especifica
     */
    function eliminarTarea() {

        axios.delete(URL + 'tarea/' + tareaSeleccionada.id,
            {
                headers: { Authorization: 'Bearer ' + JSON.parse(state.token) }
            }
        )
            .then((res) => {

                mostrarNotificacion('Tarea eliminada exitosamente', 'success')
                buscarTareas(); //actualizar lista de tareas
            })
            .catch((err) => {
                mostrarNotificacion('Error al eliminar', 'warning')
                console.log(err)
            })
    }


    

    return (
        <Card className="shadow-lg">
            <Card.Header><h5 className="text-center">Descripción</h5></Card.Header>
            <ListGroup variant="flush">

                <ListGroup.Item>

                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control className="border-0" type="text" onChange={onChangeValue} value={data.nombre} name="nombre" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control className="border-0" as="textarea" onChange={onChangeValue} value={data.descripcion ? data.descripcion : ''} name="descripcion" placeholder="Agrega una descripción" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Fecha Finalización</Form.Label>
                            <DatePicker className="border-0" selected={startDate} onChange={(date) => setStartDate(date)} name="fecha_finalizacion" />
                            {/* <input id="date" type="date" onChange={onChangeValue} value={data.fecha_finalizacion ? data.fecha_finalizacion : '2018-07-22'} name="fecha_finalizacion"></input> */}
                        </Form.Group>

                    </Form>
                    <div className="d-grid gap-2">
                        {tareaSeleccionada.finalizado ? '' :
                            <Button onClick={actualizarTarea} variant="primary" size="md">
                                Actualizar
                            </Button>
                        }
                    </div>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row className="text-center py-md-3">
                        {tareaSeleccionada.finalizado ? '' :
                            <Col sm={12} md={6}>
                                <Button onClick={finalizarTarea} className="btn btn-success w-100 mb-2" >Finalizar</Button>
                            </Col>
                        }
                        <Col sm={12} md={6}>
                            <Button onClick={eliminarTarea} className="btn btn-danger w-100" >Eliminar</Button>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

export default Descripcion;