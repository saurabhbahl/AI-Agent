import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Product } from "../../models/Product.model";

export const searchProductsTool = tool(
  async ({ query }) => {
    const products = await Product.find({
      isActive: true,
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          description: {
            $regex: query,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
      .populate("category", "name")
      .limit(10)
      .lean();

    return JSON.stringify(products);
  },
  {
    name: "search_products",
    description:
      "Search products by keyword, brand, or description",
    schema: z.object({
      query: z.string(),
    }),
  }
);