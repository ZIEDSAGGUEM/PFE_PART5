import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { useCreateOrderOnlineMutation } from '../services/appApi';
import { useSelector } from 'react-redux';

const Success = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const [createOrderOnline, { isError, isLoading }] = useCreateOrderOnlineMutation();

  useEffect(() => {
    axios
      .post(`http://localhost:8080/api/payment/${searchParams.get('payment_id')}`)
      .then((res) => {
        setStatus(res.data.result.status);
      })
      .catch((e) => console.error(e));
  }, [searchParams]);

  useEffect(() => {
    const handleOrderCreation = async () => {
      if (status === 'SUCCESS') {
        try {
          const response = await createOrderOnline({ userId: user._id });
          // Additional logic after successful order creation
          console.log("Order creation successful:", response);
          if (!isLoading && !isError) {
            setTimeout(() => {
              navigate("/");             
            }, 3000);
          }
        } catch (error) {
          // Handle error if needed
          console.error("Failed to create order:", error);
        }
      }
    };
  
    handleOrderCreation();
  }, [status, user._id, createOrderOnline]);
  

  return (
    <div className="container mt-5">
      {status === 'SUCCESS' && (
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Paiement réussi!</h4>
          <p>Merci pour votre paiement en ligne. Votre transaction a été traitée avec succès.</p>
          <hr />
        </div>
      )}
    </div>
  );
};

export default Success;
