const router = require("express").Router();
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const bodyParser = require('body-parser')
const Payment = require('../model/Payment')

router.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_API_KEY,
	key_secret: process.env.RAZORPAY_API_SECRET
});


router.post('/verification', (req, res) => {
	// do a validation
	const secret = '12345678'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment2.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
});

router.post('/razorpay', async (req, res) => {
	const payment_capture = 1
	const amount = 152
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
});

router.post('/paymentCredentials', async (req, res) => {
  //Forming Current Date
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${day}-${month}-${year}`;
  // console.log(currentDate); // "17-6-2022"

  const data = new Payment({
    userId: req.body.userId,
    razorpay_payment_id: req.body.razorpay_payment_id,
    razorpay_order_id: req.body.razorpay_order_id,
    razorpay_signature: req.body.razorpay_signature,
    date: currentDate
  });
  const response = await data.save();

  res.status(200).send({ resCode: 200, message: "Payment Credentials Saved Successfully!!" });
});

module.exports = router;
