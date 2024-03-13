import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import profile from "../assets/react.svg";
import { useSignupMutation } from "../services/appApi";
import aos from "aos";
import "aos/dist/aos.css";

function Signup({ on, handleClick }) {
  const divRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [signup, { error, isLoading, isError }] = useSignupMutation();
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  function validateImage(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "piryywx6");
    try {
      setUploadingImg(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dgkeix0lr/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  useEffect(() => {
    aos.init({ duration: 2500 });
  });

  async function handleSignup(e) {
    e.preventDefault();
    if (!image) return alert("Please Upload your profile picture");
    const url = await uploadImage(image);
    console.log(url);
    signup({ name, email, password, picture: url, address, phone }).then(
      ({ data }) => {
        if (data) {
          console.log(data);
          navigate("/");
        }
      }
    );
  }

  return (
    <Container>
      <Row>
        <Col
          md={6}
          className="signup__image--container"
          data-aos="fade-up"
        ></Col>
        <Col md={6} className="signup__form--container" data-aos="fade-down">
          <Form style={{ width: "100%" }} onSubmit={handleSignup}>
            <h1 className="text-center">Créer Compte</h1>
            <div className="signup-profile-pic_container">
              <img
                src={imagePreview || profile}
                className="signup-profile-pic"
              ></img>
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png , image/jpeg"
                onChange={validateImage}
              />
            </div>
            {isError && (
              <Alert variant="danger" className="w-100 text-center mx-auto">
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
                Votre Nom
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ton Nom"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label
                ref={divRef}
                onMouseEnter={(e) => handleClick(e, on)}
                tabIndex="0"
                aria-label="Cliquez pour entendre le contenu"
              >
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrer email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Entrer Mot De Passe"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label
                ref={divRef}
                onMouseEnter={(e) => handleClick(e, on)}
                tabIndex="0"
                aria-label="Cliquez pour entendre le contenu"
              >
                Addresse
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrer Addresse"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label
                ref={divRef}
                onMouseEnter={(e) => handleClick(e, on)}
                tabIndex="0"
                aria-label="Cliquez pour entendre le contenu"
              >
                Téléphone
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrer Numéro de Téléphone"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              ref={divRef}
              onMouseEnter={(e) => handleClick(e, on)}
              tabIndex="0"
              aria-label="Cliquez pour entendre le contenu"
            >
              <Button type="submit" disabled={isLoading}>
                Créer Compte
              </Button>
            </Form.Group>
            <p
              className="pt-3 fs-4 text-center"
              ref={divRef}
              onMouseEnter={(e) => handleClick(e, on)}
              tabIndex="0"
              aria-label="Cliquez pour entendre le contenu"
            >
              Vous avez un compte?{" "}
              <Link to="/login" className="text-white text-decoration-none">
                <button
                  className="noselect blue bt"
                  style={{ width: "25%", fontSize: 20 }}
                >
                  Connecter
                </button>
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;
