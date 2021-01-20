import React, { useState } from 'react';
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';
import RequestError, { getStripeID } from '../apiCalls';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function CreditCardForm() {
    const [error, setError] = useState(null);
    const stripe = useStripe();
    const element = useElements();


    const onSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !element) {
            return;
        }

        var intentSecret = null
        getStripeID(
            async (data) => {
                intentSecret = data["intent_id"]
                if (intentSecret != null) {
                    console.log("reached")
                    const result = await stripe.confirmCardSetup(intentSecret, {
                        payment_method: {
                            card: element.getElement(CardElement)
                        }
                    })
        
                    if (result.error) {
                        console.log(result.error.message)
                    } else {
                        console.log("SUCCESS")
                    }
                }
            },
            (error) => {
                console.log("unexpected error", error)
            }
        )
    }

    const onChange = (event) => {
        if (event.error) {
          setError(event.error.message);
        } else {
          setError(null);
        } 
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="form-row">
                <label htmlFor="card-element">
                    Enter Your Card Details
                </label>

                < CardElement
                    id="card-element"
                    options={CARD_ELEMENT_OPTIONS}
                    onChange={onChange}
                />

                <div className="card-errors" role="alert">{error}</div>
            </div>

            <div>
                <button type="submit">Add Card</button>
            </div>
            
        </form>
    );
};

export default CreditCardForm;