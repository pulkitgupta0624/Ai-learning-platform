import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getAllQuizzes = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_ALL_QUIZZES);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
}

const getQuizzesForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
}

const getQuizById = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
}

const submitQuiz = async (quizId, answers) => {
    try {
        const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId), { answers });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
}

const retakeQuiz = async (quizId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.QUIZZES.RETAKE_QUIZ(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
}

const getQuizResults = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
}

const deleteQuiz = async (quizId) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
}

const quizService = {
    getAllQuizzes,
    getQuizzesForDocument,
    getQuizById,
    submitQuiz,
    retakeQuiz,
    getQuizResults,
    deleteQuiz
}

export default quizService