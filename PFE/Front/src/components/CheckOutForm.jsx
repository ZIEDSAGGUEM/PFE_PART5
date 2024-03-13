import React, { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";
import axios from "axios";


import "react-toastify/dist/ReactToastify.css";
function CheckOutForm() {
  const user = useSelector((state) => state.user);
  const [paymentMethod, setPaymentMethod] = useState('COD'); 

  const navigate = useNavigate();
  const [amount, setAmount] = useState(user.cart.total);
  const [createOrder, { isLoading, isError, isSuccess }] =
    useCreateOrderMutation();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  async function  handlePlaceOrder(e) {
    e.preventDefault();


    try {
      if (paymentMethod === 'BYCARD') {
        // Handle Online Payment
        await axios.post("http://localhost:8080/api/payment", {amount}).then((res)=>{
        const {result}=res.data;

        window.location.href=result.link
      
      }
        
        )
        // Additional logic for online payment success
      } else if (paymentMethod === 'COD') {
        // Handle Cash on Delivery
        await createOrder({ userId: user._id, cart: user.cart, address, phone });
        if (!isLoading && !isError) {
          setTimeout(() => {
            navigate("/orders");
            toast.success("Commande Confirmé");
           
          }, 3000);
        }
      } else {
        // Handle other payment methods if needed
        console.log("Invalid payment method selected");
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <Col className="cart-payment-container">
      <Form onSubmit={handlePlaceOrder}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Votre Nom"
                value={user.name}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Votre Email"
                value={user.email}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <Form.Group className="mb-3">
              <Form.Label>Addresse</Form.Label>
              <Form.Control
                type="text"
                placeholder="Addresse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="number"
                placeholder="Téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3">
              <Form.Label>Prix</Form.Label>
              <Form.Control
                type="number"
                placeholder="Prix"
                value={amount}
                name="amount"
                disabled
              />
            </Form.Group>
          </Col>
        </Row>
        <label htmlFor="method_payment">Méthode de Paiement</label>

        <Form.Select 
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="COD">Par Livraison</option>
        <option value="BYCARD">En Ligne</option>
        </Form.Select>


        <Button className="mt-3" type="submit">
          Payée
        </Button>
      </Form>
    </Col>
  );
}

export default CheckOutForm;
