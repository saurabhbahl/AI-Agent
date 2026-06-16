import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Category } from "../../models/Category.model";

export const getCategoriesTool = tool(
  async () => {
    const categories = await Category.find().lean();

    return JSON.stringify(categories);
  },
  {
    name: "get_categories",
    description: "Get all categories",
    schema: z.object({}),
  }
);