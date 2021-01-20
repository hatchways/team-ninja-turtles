import React from "react";
import { makeStyles } from "@material-ui/core/styles"
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CreditCardForm from '../components/CreditCardForm'

const stripePromise = loadStripe("pk_test_51IB2YjBC6Uxj9HYv11e58EvmsE2mKqsqRICEB8HDp7WPyB4sXkAGjOpSrSbr9kDIqlvfbumAgu5ZPC5msiQ38eww002a5AJF79")

const PaymentInfo = () => {
    return (
        <div>
            <div>
                <h1>Payment Details</h1>
            </div>

            <Elements stripe={stripePromise}>
                <CreditCardForm />
            </Elements>
        </div>
    );
}

export default PaymentInfo;