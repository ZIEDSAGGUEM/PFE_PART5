import React from 'react'

const Visualisation = () => {
  return (
    <div className="flex flex-column flex-wrap container  ">
    <iframe
      className=" rounded-5  mx-1 "
      style={{
        background: "#21313C",
        border: "none",
        borderRadius: "2px",
        boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
        width: "375px",
        height: "50vh",
      }}
      src="https://charts.mongodb.com/charts-ecommerce-bqopp/embed/charts?id=65d74375-7648-4a0f-815c-617ba2797c19&maxDataAge=3600&theme=dark&autoRefresh=true"
    ></iframe>
    <iframe
      className=" rounded-5   "
      style={{
        background: "#21313C",
        border: "none",
        borderRadius: "2px",
        boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
        width: "400px",
        height: "50vh",
      }}
      src="https://charts.mongodb.com/charts-ecommerce-bqopp/embed/charts?id=65d758a6-29a9-4061-8d59-02039bbc2030&maxDataAge=60&theme=dark&autoRefresh=true"
    ></iframe>
 
    <iframe 
     style={{
        background: "#21313C",
        border: "none",
        borderRadius: "2px",
        boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
        width: "750px",
        height: "550px",
      }}
     src="https://charts.mongodb.com/charts-ecommerce-bqopp/embed/charts?id=65f0c220-272b-4545-8fb7-a14f8529a073&maxDataAge=60&theme=dark&autoRefresh=true"></iframe>

<iframe  style={{
        background: "#21313C",
        border: "none",
        borderRadius: "2px",
        boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
        width: "750px",
        height: "550px",
      }}
       src="https://charts.mongodb.com/charts-ecommerce-bqopp/embed/charts?id=65f0c7bf-93aa-4f40-875a-6b35f5ce1584&maxDataAge=60&theme=dark&autoRefresh=true"></iframe>
       <iframe style={{
        background: "#21313C",
        border: "none",
        borderRadius: "2px",
        boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
        width:"100%",
        height: "550px",
      }} src="https://charts.mongodb.com/charts-ecommerce-bqopp/embed/charts?id=65f0cafe-d9d6-49a6-8f78-40ae54e588ba&maxDataAge=3600&theme=dark&autoRefresh=true"></iframe>
  </div>
  )
}

export default Visualisation
