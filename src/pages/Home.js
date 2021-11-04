import React from 'react'
import {Row,Col,Button, Container, Modal, Form} from 'react-bootstrap';
import SignUpModal from '../components/SignUpModal';
import LogInModal from '../components/LogInModal';
import './Home.css'


function Home ()  {
    const [modalShowSignUp, setModalShowSignUp] = React.useState(false);
    const [modalShowLogIn, setModalShowLogIn] = React.useState(false);

    // React.useEffect(() => {
    //   if (localStorage.getItem('token') !== null) {
    //     window.location.replace('http://localhost:3000/dashboard');
    //   }
    // }, []);

    return (
        <React.Fragment>      
                <Row>
                    <Col className='Home-leftCol' xs={7}></Col>
                    <Col className='Home-rightCol Home-hWhite'  xs={5}>
                        <Container className='Home-rightCont'>
                        <div>
                            <h1 ><strong>Plurr</strong></h1>
                            <h2><strong>Stay connected with friends and the world.</strong></h2>
                        </div>
                        <div>
                            <b>Join Today</b>
                        </div>
                    <div className="mb-2 pt-3">
                        <Row>
                            <Col xs={6}>
                                <Button className='col-12 ' variant="primary" onClick={() => setModalShowLogIn(true)}>
                                    Log In
                                </Button>
                                <LogInModal
                                    show={modalShowLogIn}
                                    onHide={() => setModalShowLogIn(false)}
                                />
                            </Col>
                            <Col xs={6}>
                                <Button className='col-12' variant="secondary" onClick={() => setModalShowSignUp(true)}>
                                    Sign Up
                                </Button>
                                <SignUpModal
                                    show={modalShowSignUp}
                                    onHide={() => setModalShowSignUp(false)}
                                />
                            </Col>
                        </Row>
                    </div></Container>
                            
                        </Col>
                </Row>
        </React.Fragment>
    )
}

export default Home;
