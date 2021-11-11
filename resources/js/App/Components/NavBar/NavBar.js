import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { AuthContext } from '../../Home';

function MyNavbar(props) {


    function logout() {
        props.handleLogout();
    }
    const { state } = React.useContext(AuthContext);

    return (

        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">ToDo List</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">

                    <Nav className="mr-right">
                        <Nav.Link onClick={logout} href="/">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    )
};


export default MyNavbar;