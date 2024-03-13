import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function App() {
  return (
    <MDBFooter
      className="text-center mt-5 bg-opacity-10"
      color="white"
      bgColor="dark"
      data-aos="fade-up"
    >
      <MDBContainer>
        <section className="">
          <MDBRow>
            <MDBCol lg="6" md="6" className="mb-4 mb-md-0 mt-5">
              <h1 className="text-uppercase text-primary">X_Store ISIMS</h1>

              <ul className="list-unstyled mb-0 text-black fs-4">
                <li>
                  <i
                    className="fa fa-map-marker fs-5 mx-2 my-3"
                    aria-hidden="true"
                  >
                    {"       "}
                  </i>
                  pôle technologique de sfax, Sakiet Ezzit 3021
                </li>
                <li>
                  <i
                    className="fa fa-phone fs-5 mx-2 my-3"
                    aria-hidden="true"
                  ></i>
                  24 100 547
                </li>

                <li>
                  <i
                    className="fa fa-mail-bulk fs-5 mx-2 my-3"
                    aria-hidden="true"
                  ></i>
                  xstore.contactad@gmail.com
                </li>
                <li></li>
              </ul>
            </MDBCol>

            <MDBCol lg="6" md="6" className="mb-4 mb-md-0 ">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3274.6760460072246!2d10.754659075212068!3d34.83923677576787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1301d19db21e2b53%3A0x771c533873752407!2sISIMSF!5e0!3m2!1sfr!2stn!4v1708266630229!5m2!1sfr!2stn"
                width="375"
                height="400"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </MDBCol>
          </MDBRow>
        </section>
      </MDBContainer>
    </MDBFooter>
  );
}
