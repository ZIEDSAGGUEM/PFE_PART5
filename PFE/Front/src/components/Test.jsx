import React, { useEffect, useState } from "react";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import { Row, Col, Badge } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Story from "./Story";

const Test = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await Axios.get("http://localhost:8080/videos");
        setUploadedVideos(response.data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [uploadedVideos]);

  const handleLike = async (videoId) => {
    const userId = user._id;

    if (likedVideos.includes(videoId)) {
      alert("You have already liked this video");
      return;
    }
    try {
      await Axios.post(`http://localhost:8080/video/${videoId}`, { userId });

      setLikedVideos((prevLikedVideos) => [...prevLikedVideos, videoId]);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };
  return (
    <div
      className="bg-opacity-75 pb-5"
      style={{ backgroundColor: "#3D3B40" }}
      data-aos="fade-up"
    >
      <Story />

      {user && !user.isAdmin && (
        <>
          <h1 className="text-center text-white pt-5">Réels</h1>
          <Carousel showThumbs={false}>
            {uploadedVideos.map((video, index) =>
              video.verify ? (
                <div
                  className="flex mx-1 text-center fs-5 position-relative"
                  key={index}
                >
                  <div className="fs-2 d-flex   justify-content-around align-items-center  text-danger fw-bolder">
                    <div>
                      <img
                        src={video.createdBy.picture}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        alt="User Avatar"
                      />
                      <h2>{video.createdBy.name}</h2>
                    </div>
                    <div>
                      <i
                        onClick={() => handleLike(video._id)}
                        className="fa-solid fa fa-heart mx-3"
                        style={{ color: "red", cursor: "pointer" }}
                      ></i>
                      <p>{video.likes}</p>
                    </div>
                  </div>
                  <video
                    style={{ maxWidth: "100%", maxHeight: "650px" }}
                    className="rounded-5"
                    controls
                  >
                    <source
                      src={`http://localhost:8080/${video.videoUrl}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <h1>Juste attendre la Vérification de l'Admin</h1>
              )
            )}
          </Carousel>
        </>
      )}
    </div>
  );
};

export default Test;
