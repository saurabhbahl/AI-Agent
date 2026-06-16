import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const addToCartTool = tool(
  async ({ userId, productId, quantity }) => {
    return JSON.stringify({
      success: true,
      userId,
      productId,
      quantity,
    });
  },
  {
    name: "add_to_cart",
    description: "Add product to cart",
    schema: z.object({
      userId: z.string(),
      productId: z.string(),
      quantity: z.number(),
    }),
  }
);