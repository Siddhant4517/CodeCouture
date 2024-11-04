const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    orderId: { type: String, require: true, unique: true },
    paymentInfo: { type: String, default: "" },
    products: [
      {
        productId: { type: String, require: true },
        name: { type: String, require: true },
        size: { type: String, required: true },
        price: { type: Number, default: 1 },
        variant: { type: String, require: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    address: { type: String, require: true },
    amount: { type: Number, require: true },
    status: { type: String, default: "Pending", required: true },
  },
  { timestamps: true }
);

mongoose.models = {};

export default mongoose.model("Order", OrderSchema);
