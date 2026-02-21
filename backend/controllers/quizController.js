import Quiz from "../models/Quiz.js";

export const getAllQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ userId: req.user._id })
            .populate('documentId', 'title fileName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes,
            message: 'All quizzes fetched successfully'
        })
    } catch (error) {
        next(error)
    }
}

export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            userId: req.user._id,
            documentId: req.params.documentId
        })
            .populate('documentId', 'title fileName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes,
            message: 'Quizzes fetched successfully'
        })
    } catch (error) {
        next(error)
    }
}

export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            })
        }

        res.status(200).json({
            success: true,
            data: quiz,
            message: 'Quiz fetched successfully'
        })
    } catch (error) {
        next(error)
    }
}   

export const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body;

        if(!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: 'Answers must be an array',
                statusCode: 400
            })
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            })
        }

        if(quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: 'Quiz already completed',
                statusCode: 400
            })
        }

        let correctCount = 0;
        const userAnswers = [];

        answers.forEach(answer => {
            const { questionIndex, selectedAnswer } = answer;

            if(questionIndex < quiz.questions.length) {
                const question = quiz.questions[questionIndex];
                const isCorrect = selectedAnswer === question.correctAnswer;

                if(isCorrect) {
                    correctCount += 1;
                }

                userAnswers.push({
                    questionIndex,
                    selectedAnswer,
                    isCorrect,
                    answeredAt: new Date()
                })
            }
        })

        const score = Math.round((correctCount / quiz.questions.length) * 100);

        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = new Date();

        await quiz.save();

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: quiz.totalQuestions,
                percentage: score,
                userAnswers
            },
            message: 'Quiz submitted successfully'
        })
    } catch (error) {
        next(error)
    }
}

export const retakeQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            })
        }

        if (!quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: 'Quiz has not been completed yet',
                statusCode: 400
            })
        }

        quiz.userAnswers = [];
        quiz.score = 0;
        quiz.completedAt = null;

        await quiz.save();

        res.status(200).json({
            success: true,
            data: quiz,
            message: 'Quiz reset for retake successfully'
        })
    } catch (error) {
        next(error);
    }
}

export const getQuizResults = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('documentId', 'title');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            })
        }

        if(!quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: 'Quiz not completed',
                statusCode: 400
            })
        }

        const detailedResults = quiz.questions.map((question, index) => {
            const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);

            return {
                questionIndex: index,
                question: question.question,
                selectedAnswer: userAnswer?.selectedAnswer || null,
                correctAnswer: question.correctAnswer,
                isCorrect: userAnswer?.isCorrect || false,
                explaination: question.explaination
            }
        })

        res.status(200).json({
            success: true,
            data: {
                quiz: {
                    id: quiz._id,
                    title: quiz.title,
                    document: quiz.documentId,
                    score: quiz.score,
                    totalQuestions: quiz.totalQuestions,
                    completedAt: quiz.completedAt
                },
                results: detailedResults
            },
            message: 'Quiz results fetched successfully'
        })

    } catch (error) {
        next(error)
    }
}

export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404
            })
        }

        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
        })
        
    } catch (error) {
        next(error);
    }
}