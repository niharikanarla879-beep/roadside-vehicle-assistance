import React, { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {

  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/assistance"
      );

      const data = await response.json();

      setRequests(data.requests);

    } catch (error) {

      console.log(error);

    }

  };

  const deleteRequest = async (id) => {

    try {

      await fetch(
        `http://localhost:5000/api/assistance/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchRequests();

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchRequests();

  }, []);

  return (

    <div className="admin-container">

      <h1>Emergency Assistance Requests</h1>

      <div className="requests-grid">

        {requests.length === 0 ? (

          <p>No Requests Found</p>

        ) : (

          requests.map((request) => (

            <div className="request-card" key={request.id}>

              <h2>{request.name}</h2>

              <p>
                <strong>Phone:</strong> {request.phone}
              </p>

              <p>
                <strong>Vehicle:</strong> {request.vehicleType}
              </p>

              <p>
                <strong>Issue:</strong> {request.issue}
              </p>

              <p>
                <strong>Location:</strong> {request.location}
              </p>

              <p>
                <strong>Status:</strong> {request.status}
              </p>

              <button
                className="delete-btn"
                onClick={() => deleteRequest(request.id)}
              >
                Delete
              </button>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default Admin;