import React from "react";
import { Container, Nav, Tab, Col, Row } from "react-bootstrap";
import ClientsAdminPage from "../components/ClientsAdminPage";
import DashboardProducts from "../components/DashboardProducts";
import OrdersAdminPage from "../components/OrdersAdminPage";
import Visualisation from "../components/Visualisation";

function AdminDashboard() {
  return (
    <Container>
      <Tab.Container defaultActiveKey="home">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="home">Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="products">Produits</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="clients">Clients</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Commandes</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="products">
                <DashboardProducts />
              </Tab.Pane>

              <Tab.Pane eventKey="clients">
                <ClientsAdminPage />
              </Tab.Pane>
              <Tab.Pane eventKey="home">
                <Visualisation/>
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <OrdersAdminPage />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default AdminDashboard;
