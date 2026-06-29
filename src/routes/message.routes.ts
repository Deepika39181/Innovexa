import { Router } from 'express';
import {
  getConversations,
  createConversation,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
} from '../controllers/message.controller';
import { protect } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id/messages', getConversationMessages);
router.post('/:id/messages', sendMessage);
router.put('/:id/read', markMessageAsRead);

export default router;
