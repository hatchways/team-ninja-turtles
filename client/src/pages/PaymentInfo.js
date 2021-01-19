import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles"
import { TextField, Button } from "@material-ui/core"
import RequestError, { getStripeID } from "../apiCalls";

const PaymentInfo = () => {
    const [creditCardNumber, setCreditCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [ccv, setCCV] = useState("");

    const submit = () => {
        const stripeID = null
        getStripeID((data) => {
            stripeID = data["stripe_id"]
            console.log(stripeID)
        }, (error) => {
            console.log("Unexpected Eror")
        })

        if (stripeID != null) {
            // update credit card info
        }
    }

    return (
        <div>
            <div>
                <h1>Payment Details</h1>
            </div>

            <div>
                <h3>Enter your card details:</h3>
            </div>

            <div>
                <TextField
                    id="credit_card_num"
                    label="Credit Card Number"
                    value={creditCardNumber}
                    variant="outlined"
                    onChange={(event) => setCreditCardNumber(event.target.value)}
                /> 
            </div>

            <div>
                <TextField
                    id="exp_date"
                    label="Card Expiry Date"
                    value={expiryDate}
                    variant="outlined"
                    onChange={(event) => setExpiryDate(event.target.value)}
                />

                <TextField
                    id="ccv"
                    label="CCV"
                    value={ccv}
                    variant="outlined"
                    onChange={(event) => setCCV(event.target.value)}
                />
            </div>

            <div>
                <Button variant="outlined" onClick={submit}> 
                    Add Card
                </Button>
            </div>


        </div>
    );
}

export default PaymentInfo;