import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Order } from "../../models/Order.model";

export const trackOrderTool = tool(
  async ({ orderNumber }) => {
    const order = await Order.findOne({
      orderNumber,
    }).lean();

    if (!order) {
      return "Order not found";
    }

    return JSON.stringify(order);
  },
  {
    name: "track_order",
    description: "Track customer order",
    schema: z.object({
      orderNumber: z.string(),
    }),
  }
);