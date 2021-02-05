import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { getStripeID } from '../apiCalls';

const CARD_ELEMENT_OPTIONS = {
  showIcon: true,
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

const useStyles = makeStyles(theme => ({
  root: {
      alignItems: "center",
  },
  container: {
      width:300,
      marginTop: theme.spacing(2),
  },
  centered: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
  },
  button: {
    marginTop: theme.spacing(5)
  }, 
  input: {
      width: "300px"
  }
}));


function CreditCardForm() {
    const [numberError, setNumberError] = useState(null);
    const [expiryError, setExpiryError] = useState(null);
    const [cvcError, setCVCError] = useState(null);
    const stripe = useStripe();
    const element = useElements();
    const classes = useStyles();

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
                    // adding card via confirmCard Setup
                    const result = await stripe.confirmCardSetup(intentSecret, {
                        payment_method: {
                            card: element.getElement(CardNumberElement)
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

    const onChangeNumber = (event) => {
        if (event.error) {
            setNumberError(event.error.message);
        } else {
            setNumberError(null);
        } 
    }

    const onChangeExpiry = (event) => {
        if (event.error) {
            setExpiryError(event.error.message);
        } else {
            setExpiryError(null);
        } 
    }

    const onChangeCVC = (event) => {
        if (event.error) {
            setCVCError(event.error.message);
        } else {
            setCVCError(null);
        } 
    }

    return (
      <form onSubmit={onSubmit} className={classes.root}>
          <div className={classes.container}>
              <label>
                Card number
                <CardNumberElement
                    onChange={onChangeNumber}
                    options={CARD_ELEMENT_OPTIONS}
                    className={classes.input}
                />
              </label>
          </div>
          
          <div className={classes.container}>
              <label>
                  Expiration date
                  <CardExpiryElement
                      onChange={onChangeExpiry}
                      options={CARD_ELEMENT_OPTIONS}
                      className={classes.input}
                    />
              </label>
          </div>

          <div className={classes.container}>
              <label>
                  CVC
                  <CardCvcElement
                      onChange={onChangeCVC}
                      options={CARD_ELEMENT_OPTIONS}
                      className={classes.input}
                    />
              </label>
          </div>

          <div className={classes.centered}>
              <button className={classes.button}>Add Card</button>
          </div>
          
    </form>
    )
};

export default CreditCardForm;