import React, { useRef } from "react";
import { Badge, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function ProductPreview({
  _id,
  category,
  name,
  price,
  countInStock,
  pictures,
  on,
  handleClick,
}) {
  const divRef = useRef(null);

  return (
    <LinkContainer
      to={`/product/${_id}`}
      style={{ cursor: "pointer", margin: "10px" }}
      data-aos="slide-right"
    >
      <Card
        style={{
          margin: "10px",
        }}
        ref={divRef}
        onMouseEnter={(e) => handleClick(e, on)}
        tabIndex="0"
        data-aos="slide-right"
      >
        <Card.Img
          className="product-preview-img bg-light"
          src={pictures[0].url}
          style={{
            height: "225px",
            objectFit: "cover",
          }}
        />
        <Card.Body
          style={{ height: "150px", textAlign: "center" }}
          className=" bg-dark bg-opacity-100  text-white  "
        >
          <Card.Title>{name}</Card.Title>
          <Card.Title>{price} TND</Card.Title>
          <Card.Title>
            {parseInt(countInStock) == 0 ? (
              <Badge bg="warning">Non Disponible</Badge>
            ) : (
              <Badge bg="success">En Stock</Badge>
            )}
          </Card.Title>
          <Badge bg="danger">{category}</Badge>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}

export default ProductPreview;
