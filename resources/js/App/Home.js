import secureLS from 'secure-ls';
import React, { useState, useEffect } from "react";
import './Home.css';

/**
 * Importar componentes propios
 */
import Nav from './Components/NavBar/NavBar'
import Dashboard from './Components/Dashboard/Dashboard'

let sls = new secureLS();

export const AuthContext = React.createContext();

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":

            sls.set("user", JSON.stringify(action.payload.user));
            sls.set("token", JSON.stringify(action.payload.token));
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token
            };
        case "LOGOUT":

            sls.remove('user');
            sls.remove('token');
            return {
                ...state,
                isAuthenticated: false,
                user: null
            };
        case "RELOAD":

            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token
            };
        default:
            return state;
    }
};


function Home() {
    
    const [state, dispatch] = React.useReducer(reducer, initialState);


    // Ejecutar despues del primer renderizado
    useEffect(() => {
        /**
         * Si no existe un token almacenado se solicita iniciar sesion nuevamente
         */
        const TOKEN = sls.get('token');
        if (TOKEN) {
            const USER = sls.get('user');
            dispatch({ type: "RELOAD", payload: { user: USER, token: TOKEN } });
        }else{
            window.location = "/login"
        }
    }, []);


    /**
     * Cerrar sesion
     */
    function handleLogout() {
        dispatch({ type: "LOGOUT", payload: {} });
    }

    /**
     * Renderizar componentes solo si se está autenticado
     */

    return (
        <AuthContext.Provider value={{ state, dispatch }}>            
                <div>
                     {state.isAuthenticated ? <Nav handleLogout={handleLogout} /> : ' '}
                     {state.isAuthenticated ? <Dashboard /> : ' '}                    
                </div>           
        </AuthContext.Provider>
    );
}

export default Home;
