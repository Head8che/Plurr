import React from 'react'
import {Row,Col,Button, Container, Modal, Form} from 'react-bootstrap';
import SignUpModal from '../components/SignUpModal';
import './Home.css'


function Home ()  {
    const [modalShowSignUp, setModalShowSignUp] = React.useState(false);
    const [modalShowLogIn, setModalShowLogIn] = React.useState(false);
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



/// LOGIN MODAL
function LogInModal(props) {
  const [loading, setLoading] = React.useState(true);
    const [userModal, setuserModal] = React.useState({
      username:'',
      password: '',
  });
  React.useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      window.location.replace('http://localhost:3000/dashboard');
    } else {
      setLoading(false);
    }
  }, []);

  function handleChange(e){
    setuserModal({...userModal, [e.target.name]: e.target.value})
}  
  function handleLogIn(){
    fetch('http://127.0.0.1:8000/author/login/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(userModal)
    })

  .then(res => res.json())
  .then(data => {
    console.log(data)
    if (data.key) {
      localStorage.clear();
      localStorage.setItem('token', data.key);
      // Fix replace
      window.location.replace('http://localhost:3000/');
    } 
    // else {
    //   setEmail('');
    //   setPassword('');
    //   localStorage.clear();
    //   setErrors(true);
    // }
  });     
  }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Log into Plurr
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        <Form>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Username</Form.Label>
                <Form.Control required onChange={handleChange} name='username' type="username" value={userModal.username} placeholder="username" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required minLength="8" onChange={handleChange} name='password' type="password" value={userModal.password} placeholder="Password" />
            </Form.Group>
        </Form>
        <div className="me-auto">
              <Button variant="primary" type="submit" onClick={props.onHide, handleLogIn}>Log In</Button>
          </div>     
      </Modal.Body>
      </Modal>
    );
  }

export default Home;
