import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import aos from "aos";
import "aos/dist/aos.css";
import "./Signup.css";
import { useLoginMutation } from "../services/appApi";

const Login = ({ on, handleClick }) => {
  const divRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isError, isLoading, error }] = useLoginMutation();
  function handleLogin(e) {
    e.preventDefault();
    login({ email, password }).then(({ data }) => {
      if (data) {
        navigate("/");
      }
    });
  }

  useEffect(() => {
    aos.init({ duration: 2500 });
  });

  return (
    <Container>
      <Row>
        <Col md={6} className="login__form--container">
          <Form
            style={{ width: "100%" }}
            data-aos="fade-up"
            onSubmit={handleLogin}
          >
            <h1>Connectez-vous à votre compte</h1>
            {isError && (
              <Alert variant="danger" className="w-50 text-center mx-auto">
                {error.data}
              </Alert>
            )}
            <Form.Group>
              <Form.Label
                ref={divRef}
                onMouseEnter={(e) => handleClick(e, on)}
                tabIndex="0"
                aria-label="Cliquez pour entendre le contenu"
              >
                Eamil Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label
                ref={divRef}
                onMouseEnter={(e) => handleClick(e, on)}
                tabIndex="0"
                aria-label="Cliquez pour entendre le contenu"
              >
                Mot De Passe
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrer ton Mot de Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group
              ref={divRef}
              onMouseEnter={(e) => handleClick(e, on)}
              tabIndex="0"
              aria-label="Cliquez pour entendre le contenu"
            >
              <Button type="submit" disabled={isLoading}>
                Connecter
              </Button>
            </Form.Group>
            <p
              className="pt-3 fs-4 text-center"
              ref={divRef}
              onMouseEnter={(e) => handleClick(e, on)}
              tabIndex="0"
              aria-label="Cliquez pour entendre le contenu"
            >
              Tu n’ai pas d’e-mail?{" "}
              <Link to="/signup" className="text-white text-decoration-none">
                <button
                  className="noselect blue bt"
                  style={{ width: "25%", fontSize: 20 }}
                >
                  Créer Compte
                </button>
              </Link>
            </p>
          </Form>
        </Col>
        <Col
          md={6}
          className="login__image--container"
          data-aos="fade-down"
        ></Col>
      </Row>
    </Container>
  );
};

export default Login;
