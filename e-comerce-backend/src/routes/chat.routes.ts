import { Router } from "express";
import { askAgent } from "../ai/agent";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const answer = await askAgent(
      message
    );

    return res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "AI error",
    });
  }
});

export default router;