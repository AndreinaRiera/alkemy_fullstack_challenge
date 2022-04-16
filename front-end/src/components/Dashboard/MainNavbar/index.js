import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap';
import { useScroll } from '../../../hooks/useScroll';
import { Link } from "react-router-dom";

import './styles.scss';
import Swal from 'sweetalert2';

export default function MainNavbar({ logout, nickname }) {
    const { y, x, scrollDirection } = useScroll();

    const styles = {
        active: {
            visibility: "visible",
            transition: "all 0.5s"
        },
        hidden: {
            visibility: "hidden",
            transition: "all 0.5s",
            transform: "translateY(-100%)"
        }
    };

    const viewProfile = () => {
        Swal.fire({
            title: 'Functionality in development',
            text: 'The profile page is still in development',
            showCancelButton  : true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor : '#d33',
            confirmButtonText : 'I understand, thank you'
        });
    };

    return (
        <Navbar variant="white" fixed="top" bg="white" className="border-bottom" style={(scrollDirection && (scrollDirection === "up")) ? styles.hidden : styles.active}>
            <Container fluid>
                <Link className='navbar-brand' to="./"> YOUR ADMINPANEL </Link>

                <Navbar.Toggle aria-controls="navbar-dark-example" />
                <Navbar.Collapse id="navbar-dark-example">
                    <Nav className="ms-auto">
                        <NavDropdown
                            id="nav-dropdown-dark-example"
                            title={nickname}
                            menuVariant="light"
                            align="end"
                        >
                            <NavDropdown.Item onClick={viewProfile}>Ver mi perfil</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logout}>Cerrar sesión</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
