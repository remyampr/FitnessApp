import {loadStripe} from '@stripe/stripe-js';

 const stripePromise=loadStripe(import.meta.env.VITE_PUBLISHED_KEY_STRIPE);

 export default stripePromise;