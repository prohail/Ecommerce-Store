import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentProof = ({ orderId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // Fetch the image name from the backend on component mount
    const fetchImageName = async () => {
      try {
        const response = await axios.get(`/api/orders/img/${orderId}`);
        setImageName(response.data);
      } catch (error) {
        console.error("Error fetching image name:", error.message);
        setIsError(true);
      }
    };

    fetchImageName();
  }, [orderId]);

  useEffect(() => {
    // Fetch the image from the backend if imageName is available
    if (imageName) {
      setImageUrl(`http://localhost:4000/uploads/${imageName}`);
    }
  }, [imageName]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage("");
    setIsError(false);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        setMessage("Please select a file to upload.");
        setIsError(true);
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        `/api/orders/screenshot/${orderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("File uploaded successfully");
      setIsError(false);
      console.log("File uploaded successfully:", response.data);

      // Fetch the updated image name after successful file upload
      const fetchImageName = async () => {
        try {
          const response = await axios.get(`/api/orders/img/${orderId}`);
          setImageName(response.data.imageName);
        } catch (error) {
          console.error("Error fetching image name:", error.message);
          setIsError(true);
        }
      };

      fetchImageName();
    } catch (error) {
      setMessage("Error uploading file");
      setIsError(true);
      console.error("Error uploading file:", error.message);
    }
  };

  return (
    <div>
      <p className="fs-5">Payment Proof:</p>
      {message && (
        <div
          className={`alert ${isError ? "alert-danger" : "alert-success"}`}
          role="alert"
        >
          {message}
        </div>
      )}
      {!imageUrl && (
        <>
          <input
            className="form-control"
            type="file"
            onChange={handleFileChange}
          />
          <br />
          <button className="btn btn-primary" onClick={handleFileUpload}>
            Upload File
          </button>
          <br />
        </>
      )}
      {imageUrl && (
        <img src={imageUrl} alt="Payment Proof" style={{ maxWidth: "100%" }} />
      )}
    </div>
  );
};

export default PaymentProof;
