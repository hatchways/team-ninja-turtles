import React, { useState } from 'react'
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe} from '@stripe/react-stripe-js'
import { makeStyles } from "@material-ui/core/styles"
import RequestError, { setContestWinner } from '../apiCalls'

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
}

const useStyles = makeStyles(theme => ({
    root: {
        alignItems: "center",
    },
    container: {
        width:300,
        marginTop: theme.spacing(2),
        '& .StripeElement': {
          minWidth: '400px'
        }
    },
    centered: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
      marginTop: theme.spacing(5),
      padding: '0.5rem'
    }
}))

export default function CheckoutForm(props) {
    const [numberError, setNumberError] = useState(null);
    const [expiryError, setExpiryError] = useState(null);   
    const [cvcError, setCVCError] = useState(null);
    const stripe = useStripe()
    const elements = useElements()
    const classes = useStyles()

    const handleSubmit = async (event) => {
      event.preventDefault()

      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return
      }

      const result = await stripe.confirmCardPayment(props.clientSecret, {
          payment_method: {
          card: elements.getElement(CardNumberElement),
              billing_details: {
                  name: 'Jenny Rosen',
              },
          }
      })

      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        console.log(result.error.message)
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          setContestWinner(props.contestId, props.winningSubmission, data => {
            console.log('Winner Successfully Declared')
            alert('Winner Successfully Declared')
          }, error => {
              if (error instanceof RequestError && error.status === 400) {
                  console.log(error.body)
              } else {
                  console.log("unexpected error")
              }
          })
        } else {
          alert('Winner Successfully Declared')
        }
      }
      props.setOpenPaymentDialog(false)
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
    <form onSubmit={handleSubmit} className={classes.root}>
          <div className={classes.container}>
              <label>
                Card number
                <CardNumberElement
                    onChange={onChangeNumber}
                    options={CARD_ELEMENT_OPTIONS}
                />
              </label>
          </div>
          <div className={classes.container}>
              <label>
                  Expiration date
                  <CardExpiryElement
                      onChange={onChangeExpiry}
                      options={CARD_ELEMENT_OPTIONS}
                    />
              </label>
          </div>
          <div className={classes.container}>
              <label>
                  CVC
                  <CardCvcElement
                      onChange={onChangeCVC}
                      options={CARD_ELEMENT_OPTIONS}
                    />
              </label>
          </div>
          <div className={classes.centered}>
              <button className={classes.button}>Confirm order</button>
          </div>
    </form>
  )
}