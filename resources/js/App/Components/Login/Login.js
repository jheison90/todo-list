import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { Alert, Form, Button, Container, Row, Col } from 'react-bootstrap';

import secureLS from 'secure-ls';
import './login.css'
import {URL} from '../../Config/Server';

let sls = new secureLS();

const initialState = {
    email: "",
    password: "",
    isSubmitting: false,
    isAutenthicated: false,
};

function Login() {


    
        
    const [data, setData] = React.useState(initialState);
    const [mensajeError, setMensajeError] = React.useState(false);

    // Ejecutar despues del primer renderizado
    useEffect(() => {
        /**
         * Si no existe un token almacenado se solicita iniciar sesion nuevamente
         */
        const TOKEN = sls.get('token');
        if (TOKEN) {
            window.location = "/"
        }
        

    }, []);


    function handleLoginClick(e) {
        e.preventDefault();

        setData({
            ...data,
            [e.target.name]: e.target.value
        });



        Axios.post(URL+'login',
            { email: data.email, password: data.password }
            )
            .then((res) => {

                sls.set("user", JSON.stringify(res.data.data));
                sls.set("token", JSON.stringify(res.data.access_token));

                window.location = '/';
            })
        .catch((err) => {

            setMensajeError(true);
            console.log(err)
        })

    //let resJson = data;
    // console.log(data)


}

function handleInputChange(e) {
    setData({
        ...data,
        [e.target.name]: e.target.value
    });
}



return (

    <Container className="login">

        <Row>
            <Col md={12} className="p-3">
                <h3 className="text-center">TODO List</h3>
            </Col>

            <Col md={12}>
                {mensajeError ?
                    <Alert variant="danger">
                        Datos no válidos, intentelo de nuevo.
                    </Alert>
                    : ' '}
                <Form className="bg-light p-5 shadow">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="Ingresar Email" value={data.email} onChange={handleInputChange} name="email" />
                        
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={data.password} onChange={handleInputChange} name="password" />
                    </Form.Group>
                    
                    <Button className="w-100" variant="primary" type="button" onClick={handleLoginClick} >
                        Login
                    </Button>
                </Form>

            </Col>
        </Row>
    </Container >

);
}


export default Login;