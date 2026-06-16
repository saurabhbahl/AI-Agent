import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Product } from "../../models/Product.model";

export const getProductTool = tool(
  async ({ productId }) => {
    const product = await Product.findById(productId).lean();

    if (!product) {
      return "Product not found";
    }

    return JSON.stringify(product);
  },
  {
    name: "get_product",
    description: "Get product details",
    schema: z.object({
      productId: z.string(),
    }),
  }
);