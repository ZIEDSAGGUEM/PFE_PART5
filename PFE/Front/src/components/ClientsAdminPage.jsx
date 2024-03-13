import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "../axios";
import Loading from "./Loading";
function ClientsAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/users")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, []);

  if (loading) return <Loading />;
  if (users?.length == 0)
    return <h2 className="py-2 text-center">Non Utilisateurs</h2>;

  return (
    <div className=" d-flex flex-wrap">
        <iframe
      className=" rounded-5 mx-auto  mt-4 "
      style={{
        background: "#21313C",
        border: "none",
        borderRadius: "2px",
        boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
        width: "250px",
        height: "250px",
      }}
      src="https://charts.mongodb.com/charts-ecommerce-bqopp/embed/charts?id=65d7420b-bc0a-4506-86bb-da80602896f0&maxDataAge=60&theme=dark&autoRefresh=true"
    ></iframe>
   
    <Table responsive bordered hover className="mt-5 table-dark">
    
      <thead>
        <tr>
          <th>Client Id</th>
          <th>Client Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr>
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );

  return <div>ClientsAdminPage</div>;
}

export default ClientsAdminPage;
