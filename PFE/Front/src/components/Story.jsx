import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form } from "react-bootstrap";

function Story() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPath, setVideoPath] = useState(null);
  const [ord, setOrd] = useState("");
  const [verify, setVerify] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/videos");
        setUploadedVideos(response.data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [uploadedVideos]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a video file");
      return;
    }
    const userId = user._id;
    const order = ord;
    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("userId", userId);
    formData.append("order", order);
    try {
      await axios.post("http://localhost:8080/upload", formData);
      toast.success(
        "Video added successfully. The admin will review the content."
      );
    } catch (error) {
      toast.error("Error uploading video:", error);
    }
  };

  const handleLike = async (videoId) => {
    const userId = user._id;

    if (likedVideos.includes(videoId)) {
      alert("You have already liked this video");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/video/${videoId}`, { userId });

      setLikedVideos((prevLikedVideos) => [...prevLikedVideos, videoId]);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };
  const handleVerify = async (videoId) => {
    setVerify(true);
    try {
      await axios.post(`http://localhost:8080/${videoId}/verify`, {
        verify,
      });
    } catch (error) {
      console.log("Error Verify video:", error);
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`http://localhost:8080/${videoId}/delete`);
    } catch (error) {
      console.log("Error Delete video:", error);
    }
  };

  return (
    <div className=" mb-14">
      {user && user.isAdmin && (
        <>
          <h1 className=" text-center ">Vérification</h1>

          <div className=" d-flex flex-wrap justify-content-center ">
            {uploadedVideos.map((video, index) => (
              <div
                className="  mx-1 text-center fs-5  position-relative"
                key={index}
              >
                <video width="550" height="500" className=" rounded-9" controls>
                  <source
                    src={`http://localhost:8080/${video.videoUrl}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div
                  className="fs-2 position-absolute top-50 text-danger fw-bolder"
                  style={{ right: "10px" }}
                >
                  <i
                    onClick={() => handleLike(video._id)}
                    className="fa-solid fa fa-heart  "
                    style={{ color: "red", cursor: "pointer" }}
                  ></i>
                  <p>{video.likes}</p>
                </div>
                <h2>{video.createdBy.name}</h2>
                <button
                  onClick={() => handleVerify(video._id)}
                  className=" bg-primary rounded-2 "
                  disabled={video.verify}
                >
                  <i className=" fas fa-check mx-1"></i>
                </button>
                {"                                             "}
                <button
                  onClick={() => handleDelete(video._id)}
                  className=" bg-danger   rounded-2 "
                >
                  <i className=" fas fa-trash mx-1"></i>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {user && !user.isAdmin && user.orders.length > 0 && (
        <div className=" d-flex justify-content-center align-items-center pt-3">
          <input
            type="file"
            accept="video/*"
            hidden
            id="fileInput"
            className="bg-danger"
            onChange={handleFileChange}
            disabled={user.orders.length == 0}
          />
          <label htmlFor="fileInput">
            <i
              className=" fas fa-add fs-2 p-2 mx-5  rounded-circle"
              style={{ cursor: "pointer", backgroundColor: "#F1F6F9" }}
            ></i>
          </label>

          <ToastContainer />
          <Form.Select
            className=" w-auto mx-5"
            onChange={(e) => setOrd(e.target.value)}
          >
            <option value="" disabled>
              Select an order
            </option>
            {user.orders.map((order, key) => (
              <option key={key} value={order}>
                {order}
              </option>
            ))}
          </Form.Select>
          <button
            className=" noselect blue bt w-responsive "
            style={{ fontSize: 20 }}
            onClick={handleUpload}
          >
            Ajouter Votre Réel
          </button>
        </div>
      )}
    </div>
  );
}

export default Story;
