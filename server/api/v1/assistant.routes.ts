import { Router, Request, Response } from 'express';
import { AiAssistantService } from '../../services/ai-assistant.service';

const router = Router();

// Ask Research Integrity Assistant
router.post('/ask', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    const result = await AiAssistantService.askAssistant(message, context);
    res.json({
      success: true,
      reply: result.reply,
      source: result.source,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Error processing assistant query.' });
  }
});

export default router;
