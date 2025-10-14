import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";

const QuestionPage = ({
  currentStep,
  totalPages,
  progress,
  questions,
  answers,
  questionsPerPage,
  onAnswerChange,
  onNext,
  onPrevious,
  isComplete,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <ProgressBar
          currentStep={currentStep}
          totalPages={totalPages}
          progress={progress}
        />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="space-y-8">
            {questions.map((question, idx) => (
              <QuestionCard
                key={question.id}
                question={question}
                questionNumber={(currentStep - 1) * questionsPerPage + idx + 1}
                answer={answers[question.id]}
                onAnswerChange={onAnswerChange}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onPrevious}
            className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold flex items-center cursor-pointer ease-in"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={!isComplete}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center transition-all ${
              isComplete
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 cursor-pointer ease-in font-semibold shadow-sm"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            {currentStep === totalPages ? "Review Answers" : "Next"}
            <ChevronRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
