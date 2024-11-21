import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from './Loading';

const apiUrl = import.meta.env.VITE_API_URL;

function Receipt() {
    const [transDetails,setTransDetails] = useState()
    const {id} = useParams()
    console.log("ID is", {id})
    useEffect(()=>{

        const fetchTransDetails = async() =>{
            try {
            
            const response = await axios.get(`${apiUrl}/api/dashboard/transaction/${id}`)
            
            setTransDetails(response.data.transactiondetails)
            console.log("transaction details is", response.data.transactiondetails)
        } catch (error) {
            console.log(error)
        }
        };

        if (id) {
            fetchTransDetails(); 
        } else {
            console.error("No transaction ID provided");
        }
    }, [id])
    if (!transDetails) {
        return <Loading/>;
    }
  return (
    
    <div>
        <h2>Receipt</h2>
        <p>Transaction ID: {transDetails._id}</p>
        <p>Reference Code: {transDetails.referenceCode}</p>
        <p>Status: {transDetails.status}</p>
        <p>Transaction Type: {transDetails.transactionType}</p>
        <p>Amount: {transDetails.amount.currency} {transDetails.amount.value}</p>
        <p>Fees: {transDetails.fees.currency} {transDetails.fees.value}</p>
        <p>Transaction Direction: {transDetails.transactionDirection}</p>
        <p>Transfer Type: {transDetails.transferType}</p>
        <p>Created At: {new Date(transDetails.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(transDetails.lastUpdate).toLocaleString()}</p>

    </div>
  )
}

export default Receipt