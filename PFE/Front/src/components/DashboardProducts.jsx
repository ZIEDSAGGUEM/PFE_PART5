import React from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteProductMutation } from "../services/appApi";
import "./DashboardProducts.css";
import Pagination from "./Pagination";

function DashboardProducts() {
  const products = useSelector((state) => state.products);
  const user = useSelector((state) => state.user);
  // removing the product
  const [deleteProduct, { isLoading, isSuccess }] = useDeleteProductMutation();
  function handleDeleteProduct(id) {
    // logic here
    if (window.confirm("Are you sure?"))
      deleteProduct({ product_id: id, user_id: user._id });
  }

  function TableRow({ pictures, _id, name, countInStock, price }) {
    return (
      <tr>
        <td>
          <img src={pictures[0].url} className="dashboard-product-preview" />
        </td>
        <td>{_id}</td>
        <td>{name}</td>
        <td>{price}</td>
        <td>{countInStock}</td>
        <td>
          <Button
            className="btn btn-danger my-3"
            onClick={() => handleDeleteProduct(_id, user._id)}
            disabled={isLoading}
          >
            Supprimer
          </Button>
          <Link to={`/product/${_id}/edit`} className="btn btn-warning">
            Editer
          </Link>
        </td>
      </tr>
    );
  }

  return (
    <Table bordered hover responsive className="mt-5 table-dark">
      <thead>
        <tr>
          <th></th>
          <th>Produit ID</th>
          <th>Nom de Produit</th>
          <th>Prix de Produit</th>
          <th>Quantité</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <Pagination
          data={products}
          RenderComponent={TableRow}
          pageLimit={1}
          dataLimit={5}
          tablePagination={true}
        />
      </tbody>
    </Table>
  );
}

export default DashboardProducts;
