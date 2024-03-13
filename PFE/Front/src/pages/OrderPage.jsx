import React, { useEffect, useState } from "react";
import { Badge, Button, Container, Modal, Table } from "react-bootstrap";

import { useSelector } from "react-redux";
import axios from "../axios";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation

function OrderPage() {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderToShow, setOrderToShow] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  function showOrder(productsObj) {
    let productsToShow = products.filter((product) => productsObj[product._id]);
    productsToShow = productsToShow.map((product) => {
      const productCopy = { ...product };
      productCopy.count = productsObj[product._id];
      delete productCopy.description;
      return productCopy;
    });
    console.log(productsToShow);
    setShow(true);
    setOrderToShow(productsToShow);
  }

  const generatePDF = () => {
    const pdf = new jsPDF();
    const yPos = pdf.getNumberOfPages() * 25;
    const prod = Object.values(orderToShow);
    pdf.text(`Nom d'Utilisateur : ${user.name}`, 20, yPos + 10);
    pdf.text(`Email d'Utilisateur : ${user.email}`, 20, yPos + 20);

    // Iterate through each product
    prod.forEach((product, index) => {
      const yPos = pdf.getNumberOfPages() * 25; // Adjust the y-position based on the page number

      // Title
      pdf.setFontSize(18);
      pdf.setFont("bold");
      pdf.text("Détails de Commande", 20, yPos);

      // Order ID and Date
      pdf.setFontSize(12);
      pdf.setFont("normal");

      pdf.text(`Produit ID: ${product._id}`, 20, yPos + 30);
      pdf.text(`Date: ${new Date().toLocaleString()}`, 20, yPos + 40);

      // Product Details
      pdf.text("Produit:", 20, yPos + 55);
      pdf.addImage(product.pictures[0].url, "JPEG", 20, yPos + 60, 30, 30);
      pdf.text(`Nom de Produit : ${product.name}`, 60, yPos + 70);
      pdf.text(`Categorie: ${product.category}`, 60, yPos + 80);
      pdf.text(`Prix: ${Number(product.price)} TND`, 60, yPos + 90);
      pdf.text(`Nombre: ${product.count}`, 60, yPos + 100);
      pdf.text("Frais de Livraison: 8 TND", 60, yPos + 110);
      pdf.text(
        `Prix Totale: ${Number(product.price) * product.count - 8} TND`,
        60,
        yPos + 120
      );

      // Add other product details as needed

      // Add a separator line
      pdf.line(25, yPos + 120, 195, yPos + 125);

      // Add page if it's not the last product
      if (index !== prod.length - 1) {
        pdf.addPage(); // Move to the next page for the next product
      }
    });

    pdf.save("orders.pdf");
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/users/${user._id}/orders`)
      .then(({ data }) => {
        setLoading(false);
        setOrders(data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, [orders]);

  if (orders.length === 0) {
    return <h1 className="text-center pt-3">Commandes Vides</h1>;
  }

  return (
    <Container data-aos="fade">
      <h1 className="text-center">Vos Commandes</h1>
      <Table bordered hover responsive className="mt-5 table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Date</th>
            <th>Adresse</th>
            <th>Total</th>
            <th>Voir Commande</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order,key) => (
            <tr key={key}>
              <td >{order._id}</td>
              <td>
                <Badge
                  bg={`${
                    order.status == "En Attende de Confirmation"
                      ? "danger"
                      : "success"
                  }`}
                  text="white"
                >
                  {order.status}
                </Badge>
              </td>
              <td>{order.date}</td>
              <td>{order.address}</td>

              <td>{order.total} TND</td>
              <td>
                <span
                  style={{ cursor: "pointer" }}
                  className="mx-2"
                  onClick={() => showOrder(order.products)}
                >
                  <i className="fa fa-eye "></i>
                  Voir
                </span>
                <span onClick={generatePDF} style={{ cursor: "pointer" }}>
                  <i className="fa fa-address-book"></i>
                  Facture
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Détails de Commande</Modal.Title>
        </Modal.Header>
        {orderToShow.map((order,key) => (
          <div className="order-details__container d-flex justify-content-around py-2" key={key}>
            <img
              src={order.pictures[0].url}
              style={{ maxWidth: 100, height: 100, objectFit: "cover" }}
            />
            <p>
              <span>{order.count} x </span> {order.name}
            </p>
            <p>Prix: {Number(order.price) * order.count} TND</p>
          </div>
        ))}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default OrderPage;
