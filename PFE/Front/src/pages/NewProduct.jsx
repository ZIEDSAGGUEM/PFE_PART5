import React, { useState } from "react";
import { Alert, Col, Container, Form, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../services/appApi";
import axios from "../axios";
import "./NewProduct.css";

function NewProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null);
  const navigate = useNavigate();
  const [createProduct, { isError, error, isLoading, isSuccess }] =
    useCreateProductMutation();

  function handleRemoveImg(imgObj) {
    setImgToRemove(imgObj.public_id);
    axios
      .delete(`/images/${imgObj.public_id}/`)
      .then((res) => {
        setImgToRemove(null);
        setImages((prev) =>
          prev.filter((img) => img.public_id !== imgObj.public_id)
        );
      })
      .catch((e) => console.log(e.message));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !price ||
      !countInStock ||
      !category ||
      !images.length
    ) {
      return alert("Please fill out all the fields");
    }
    createProduct({
      name,
      description,
      price,
      countInStock,
      category,
      images,
    }).then(({ data }) => {
      if (data.length > 0) {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    });
  }

  function showWidget() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dezeep7h1",
        uploadPreset: "vfobgycq",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setImages((prev) => [
            ...prev,
            { url: result.info.url, public_id: result.info.public_id },
          ]);
        }
      }
    );
    widget.open();
  }

  return (
    <Container>
      <Row>
        <Col md={6} className="new-product__form--container">
          <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <h1 className="mt-4">Create a product</h1>
            {isSuccess && (
              <Alert variant="success">Product created with succcess</Alert>
            )}
            {isError && <Alert variant="danger">{error.data}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Product name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom de Produit"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Description de Produit "
                style={{ height: "100px" }}
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prix(TND)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Prix (TND)"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantité</Form.Label>
              <Form.Control
                type="number"
                placeholder="countInStock"
                value={countInStock}
                required
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              onChange={(e) => setCategory(e.target.value)}
            >
              <Form.Label>Categorie</Form.Label>
              <Form.Select>
                <option disabled selected>
                  -- Select One --
                </option>
                <option value="technologies">technologies</option>
                <option value="tablettes">tablettes</option>
                <option value="téléphones">téléphones</option>
                <option value="pc portables">pc portables</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Button type="button" onClick={showWidget}>
                Upload Images
              </Button>
              <div className="images-preview-container">
                {images.map((image, key) => (
                  <div className="image-preview" key={key}>
                    <img src={image.url} />
                    {imgToRemove != image.public_id && (
                      <i
                        className="fa fa-times-circle"
                        onClick={() => handleRemoveImg(image)}
                      ></i>
                    )}
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group>
              <Button type="submit" disabled={isLoading || isSuccess}>
                Créer Produit
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={6} className="new-product__image--container"></Col>
      </Row>
    </Container>
  );
}

export default NewProduct;
