import axios from "../axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ProductPreview from "../components/ProductPreview";
import "./CategoryPage.css";
import Pagination from "../components/Pagination";
import Aos from "aos";
function CategoryPage() {
  const { category } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.onspeechend = function () {
      recognition.stop();
      setListening(false);
    };

    recognition.onerror = function () {
      setListening(false);
    };

    recognition.onresult = function (e) {
      const transcript = e.results[0][0].transcript;
      setSearchTerm(transcript);
    };

    recognition.start();
    setListening(true);
  };

  const handleSearch = () => {
    // Perform the search using the transcript value
    console.log("Search:", transcript);
  };
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/products/category/${category}`)
      .then(({ data }) => {
        setLoading(false);
        setProducts(data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e.message);
      });
  }, [category]);

  if (loading) {
    <Loading />;
  }

  const productsSearch = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function ProductSearch({
    _id,
    category,
    name,
    pictures,
    price,
    countInStock,
  }) {
    return (
      <ProductPreview
        _id={_id}
        category={category}
        name={name}
        countInStock={countInStock}
        pictures={pictures}
        price={price}
      />
    );
  }

  return (
    <div className="category-page-container">
      <div
        className={`pt-3 ${category}-banner-container bg-dark category-banner-container`}
      >
        <h1 className="text-center">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
      </div>
      <div className="filters-container d-flex justify-content-center pt-4 pb-4">
        <input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i
          id="mic"
          className={
            listening
              ? "fa fa-microphone mt-2 mx-3 bg-black rounded-circle p-3"
              : "fa fa-microphone mt-2 mx-3 bg-secondary rounded-circle p-3"
          }
          aria-hidden="true"
          type="button"
          onClick={startListening}
        ></i>
      </div>
      {productsSearch.length === 0 ? (
        <h1>No products to show</h1>
      ) : (
        <Container>
          <Row className="mx-auto">
            <Col lg={12}>
              <Pagination
                data={productsSearch}
                RenderComponent={ProductSearch}
                pageLimit={1}
                dataLimit={5}
                tablePagination={false}
              />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default CategoryPage;
