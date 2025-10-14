import React, { useState } from "react";
import IntroPage from "./assessment/IntroPage";
import QuestionPage from "./assessment/QuestionPage";
import ReviewPage from "./assessment/ReviewPage";
import LoadingModal from "./assessment/LoadingModal";
import AssessmentResults from "../../pages/AssessmentResults";
import { assessmentQuestions } from "./assessment/assessmentQuestions";
import { createAssessment } from "../../services/assessment";

const AssessmentContent = ({setCurrentView}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const questions = assessmentQuestions;
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const maxSteps = totalPages + 2;

  const getCurrentPageQuestions = () => {
    if (currentStep === 0 || currentStep > totalPages) return [];
    const startIdx = (currentStep - 1) * questionsPerPage;
    const endIdx = startIdx + questionsPerPage;
    return questions.slice(startIdx, endIdx);
  };

  const handleAnswerChange = (questionId, value, scoreImpact) => {
    setAnswers({
      ...answers,
      [questionId]: { value, scoreImpact },
    });
  };

  const calculateProgress = () => {
    const answeredCount = Object.keys(answers).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  const isCurrentPageComplete = () => {
    const currentQuestions = getCurrentPageQuestions();
    return currentQuestions.every((q) => answers[q.id]);
  };

  const handleNext = () => {
    if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const questionsAnswered = questions.map((q) => ({
        questionId: q.id,
        question: q.question,
        answer: answers[q.id]?.value || "",
        scoreImpact: answers[q.id]?.scoreImpact || 0,
      }));

      const result = await createAssessment({ questionsAnswered });
      console.log("✅ Assessment result:", result);

      setAssessmentResult(result.assessment); // ✅ store the result
      setLoading(false);
      setCurrentStep(maxSteps); // ✅ switch to results view
    } catch (err) {
      console.error("❌ Submit error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit assessment. Please try again."
      );
      setLoading(false);
    }
  };

  // ✅ If assessment result exists, show results component inside the same content
  if (assessmentResult) {
    return (
      <AssessmentResults
        assessment={assessmentResult}
        setCurrentView={setCurrentView}
      />
    );
  }

  if (currentStep === 0) {
    return (
      <IntroPage onNext={handleNext} onCancel={() => setCurrentView("dashboard")} />
    );
  }

  if (currentStep > 0 && currentStep <= totalPages) {
    return (
      <QuestionPage
        currentStep={currentStep}
        totalPages={totalPages}
        progress={calculateProgress()}
        questions={getCurrentPageQuestions()}
        answers={answers}
        questionsPerPage={questionsPerPage}
        onAnswerChange={handleAnswerChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isComplete={isCurrentPageComplete()}
      />
    );
  }

  return (
    <>
      <LoadingModal loading={loading} />
      <ReviewPage
        questions={questions}
        answers={answers}
        error={error}
        loading={loading}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AssessmentContent;
