import Stripe from "stripe";
import StripePayment from "../models/PaymentStripe.js";
import Appointment from "../models/Appointment.js";
import Schedule from "../models/Schedule.js";
export const createStripePayment = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy được lịch đăng ký" });
    }

    const amount = appointment.price * 100;

    const payment = await StripePayment.create({
      appointmentId,
      amount,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "vnd",
      metadata: {
        paymentId: payment._id.toString(),
      },
    });

    payment.stripePaymentId = paymentIntent.id;
    await payment.save();

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("Lỗi khi tạo Stripe Payment:", error);
    return res.status(500).json({ message: "Lỗi khi tạo Stripe Payment" });
  }
};

export const stripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const paymentId = paymentIntent.metadata.paymentId;

        await StripePayment.findByIdAndUpdate(paymentId, {
          status: "paid",
          paidAt: new Date(),
        });

        console.log("Payment success:", paymentId);

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        const paymentId = paymentIntent.metadata.paymentId;

        const payment = await StripePayment.findByIdAndUpdate(
          paymentId,
          {
            status: "failed",
          },
          { new: true },
        );
        
        if (payment) {
          const appointment = await Appointment.findById(payment.appointmentId);
          if (appointment) {
            await Schedule.findByIdAndDelete(appointment.scheduleId);
            await Appointment.findByIdAndDelete(appointment._id);
          }
        }
        console.log("Payment failed:", paymentId);

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.log("Webhook processing error:", error);
    res.status(500).send("Webhook handler failed");
  }
};