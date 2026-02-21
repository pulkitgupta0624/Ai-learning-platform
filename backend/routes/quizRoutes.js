import express from 'express'
import {
    getAllQuizzes,
    getQuizzes,
    getQuizById,
    submitQuiz,
    retakeQuiz,
    getQuizResults,
    deleteQuiz
} from '../controllers/quizController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/', getAllQuizzes);
router.get('/quiz/:id', getQuizById);
router.post('/:id/submit', submitQuiz);
router.post('/:id/retake', retakeQuiz);
router.get('/:id/results', getQuizResults);
router.delete('/:id', deleteQuiz);
router.get('/:documentId', getQuizzes);

export default router