import { Router, Request, Response } from 'express';
import { AiAssistantService } from '../../services/ai-assistant.service';

const router = Router();

const handleAssistantQuery = async (req: Request, res: Response) => {
  try {
    const message = req.body.message || req.body.query || '';
    const context = req.body.context || '';

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    const result = await AiAssistantService.askAssistant(message.trim(), context);
    res.json({
      success: true,
      reply: result.reply,
      answer: result.reply,
      source: result.source,
    });
  } catch (err: any) {
    console.error('AI Assistant endpoint error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Error processing assistant query.' 
    });
  }
};

// Support both /ask and /chat endpoints
router.post('/ask', handleAssistantQuery);
router.post('/chat', handleAssistantQuery);

export default router;
