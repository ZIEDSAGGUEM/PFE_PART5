import React, { useEffect, useState } from "react";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../axios";
import Loading from "./Loading";
import Pagination from "./Pagination";

function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const products = useSelector((state) => state.products);
  const [orderToShow, setOrderToShow] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  function markShipped(orderId, ownerId) {
    axios
      .patch(`/orders/${orderId}/mark-shipped`, { ownerId })
      .then(({ data }) => setOrders(data))
      .catch((e) => console.log(e));
  }

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

  useEffect(() => {
    setLoading(true);
    axios
      .get("/orders")
      .then(({ data }) => {
        setLoading(false);
        setOrders(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return <h1 className="text-center pt-4">No orders yet</h1>;
  }

  function TableRow({
    _id,
    count,
    owner,
    total,
    status,
    paymentMethod,
    products,
    address,
  }) {
    return (
      <tr>
        <td>{_id}</td>
        <td>{owner?.name}</td>
        <td>{count}</td>
        <td>{total}</td>
        <td>{address}</td>
        <td>{paymentMethod}</td>
        <td>
          {status === "En Attende de Confirmation" ? (
            <Button size="sm" onClick={() => markShipped(_id, owner?._id)}>
              Confirmer
            </Button>
          ) : (
            <Badge bg="success">Commande Confirmée</Badge>
          )}
        </td>
        <td>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => showOrder(products)}
          >
            View order <i className="fa fa-eye"></i>
          </span>
        </td>
      </tr>
    );
  }

  return (
    <>
      <Table bordered hover responsive className="mt-5 table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom de Client</th>
            <th>Items</th>
            <th>Commande Total</th>
            <th>Addresse</th>
            <th>Paiement</th>
            <th>Status</th>
            <th>Check</th>
          </tr>
        </thead>
        <tbody>
          <Pagination
            data={orders}
            RenderComponent={TableRow}
            pageLimit={1}
            dataLimit={10}
            tablePagination={true}
          />
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order details</Modal.Title>
        </Modal.Header>
        {orderToShow.map((order) => (
          <div className="order-details__container d-flex justify-content-around py-2">
            <img
              src={order.pictures[0].url}
              style={{ maxWidth: 100, height: 100, objectFit: "cover" }}
            />
            <p>
              <span>{order.count} x </span> {order.name}
            </p>
            <p>Price: {Number(order.price) * order.count} TND</p>
          </div>
        ))}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrdersAdminPage;
