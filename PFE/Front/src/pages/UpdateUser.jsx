import React, { useState } from "react";
import { useUpdateUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateUser() {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [phone, setPhone] = useState(user.phone);
  const navigate = useNavigate();

  const userId = user._id;

  const [updateUser, { isLoading, isError, isSuccess }] =
    useUpdateUserMutation();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      address,
      phone,
    };

    updateUser({ userId, userData })
      .then((res) => {
        // Handle success
        toast.success("Modification avec Succées:");

        setTimeout(() => {
          navigate("/");
        }, 3500);
      })
      .catch((error) => {
        // Handle error
        toast.error("Error updating user:");
      });
  };

  return (
    <Form onSubmit={handleSubmit} className=" container w-50 mt-5">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Votre Nom</Form.Label>
        <Form.Control
          value={name}
          type="name"
          placeholder="Entrer Votre Nom"
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          value={email}
          type="email"
          placeholder="Entrer Votre Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Addresse</Form.Label>
        <Form.Control
          value={address}
          type="text"
          placeholder="Entrer Votre Addresse"
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Téléphone</Form.Label>
        <Form.Control
          value={phone}
          type="text"
          placeholder="Entrer Votre Numéro de Téléphone"
          onChange={(e) => setPhone(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Button type="submit" disabled={isLoading}>
          Modifier
        </Button>
        <ToastContainer />
      </Form.Group>
    </Form>
  );
}

export default UpdateUser;
