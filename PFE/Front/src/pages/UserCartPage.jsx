import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Row,
  Alert,
  Col,
  Table,
  Form,
  Button,
} from "react-bootstrap";
import "./CartPage.css";
import {
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
  useRemoveFromCartMutation,
} from "../services/appApi";
import CheckOutForm from "../components/CheckOutForm";
import ToastMessage from "../components/ToastMessage";
import { Link, useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
const UserCartPage = () => {
  const Delivery = 8;
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);

  const userObj = user.cart;
  let cart = products.filter((product) => userObj[product._id] != null);
  const [increaseCart, { isError }] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const navigate = useNavigate();

  const [createOrder, { isLoading: load, isError: err, isSuccess }] =
    useCreateOrderMutation();
  const phone = user.phone;
  const address = user.address;
  const amount = user.cart.total;
  async function handlePlaceOrder(e) {
    e.preventDefault();

    try {
      if (paymentMethod === "BYCARD") {
        // Handle Online Payment

        await axios
          .post("http://localhost:8080/api/payment", { amount })
          .then((res) => {
            const { result } = res.data;

            window.location.href = result.link;
          });
        // Additional logic for online payment success
      } else if (paymentMethod === "COD") {
        // Handle Cash on Delivery
        await createOrder({
          userId: user._id,
          cart: user.cart,
          address,
          phone,
        });
        if (!load && !err) {
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

  function handleDecrease(product) {
    const quantity = user.cart.count;
    if (quantity <= 0) return alert("Can't proceed");
    decreaseCart(product);
  }
  return (
    <Container className="product p-5 mt-5">
      <h1 className="text-center">Shopping Cart</h1>
      <Row className="mt-5" data-aos="fade">
        {cart.length == 0 && (
          <Col>
            <Alert variant="info" className="text-center">
              Votre Carte est Vide . Ajouter des Produits
            </Alert>
          </Col>
        )}

        {cart.length > 0 && (
          <>
            <Col md={6}>
              <>
                <Table
                  responsive="sm"
                  variant="dark"
                  className="cart-table text-center "
                >
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th>Produit</th>
                      <th>Prix</th>
                      <th>Quantité</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* loop through cart products */}
                    {cart.map((item, key) => (
                      <tr key={key}>
                        <td>&nbsp;</td>
                        <td>
                          {!isLoading && (
                            <i
                              className="fa fa-times"
                              style={{ marginRight: 10, cursor: "pointer" }}
                              onClick={() =>
                                removeFromCart({
                                  productId: item._id,
                                  price: item.price,
                                  userId: user._id,
                                })
                              }
                            ></i>
                          )}
                          <img
                            src={item.pictures[0].url}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>{item.price} TND</td>
                        <td>
                          <span className="quantity-indicator">
                            <i
                              className="fa fa-minus-circle"
                              onClick={() =>
                                handleDecrease({
                                  productId: item._id,
                                  price: item.price,
                                  userId: user._id,
                                })
                              }
                            ></i>
                            <span>{user.cart[item._id]}</span>
                            <i
                              className="fa fa-plus-circle"
                              onClick={() =>
                                increaseCart({
                                  productId: item._id,
                                  price: item.price,
                                  countInStock: item.countInStock,
                                  userId: user._id,
                                })
                              }
                            ></i>
                            {isError && (
                              <ToastMessage
                                bg="danger"
                                title="Echec pour ajouter au carte"
                                body={`Out Of Stock`}
                              />
                            )}
                          </span>
                        </td>
                        <td>{item.price * user.cart[item._id]} TND</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="product text-center p-5">
                  <h3 className="h4 pt-4 ">
                    Total Produit: {user.cart.total} TND
                  </h3>
                  {paymentMethod === "COD" && (
                    <>
                      <h3 className="h4 pt-4">
                        Frais de Livraison: {Delivery} TND
                      </h3>
                      <h3 className="h4 pt-4">
                        Total: {user.cart.total - Delivery} TND
                      </h3>
                    </>
                  )}
                </div>
              </>
            </Col>
            <Col md={6}>
              <Link
                to="/update"
                className=" mb-14 text-decoration-none fs-4 text-center"
              >
                <i className=" fas fa-edit"></i>Modifier
              </Link>
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
                        value={user.address}
                        disabled
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
                        value={user.phone}
                        disabled
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
                  className=" w-50"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="COD">Par Livraison</option>
                  <option value="BYCARD">En Ligne</option>
                </Form.Select>

                <Button className="mt-3" type="submit">
                  Payée
                </Button>
              </Form>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};

export default UserCartPage;
