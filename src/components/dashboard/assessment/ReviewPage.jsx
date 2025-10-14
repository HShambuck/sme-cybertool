import React from "react";
import { ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";

const ReviewPage = ({
  questions,
  answers,
  error,
  loading,
  onPrevious,
  onSubmit,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Review Your Answers
          </h2>
          <p className="text-slate-600 mb-6">
            Please review your responses before submitting. You can go back to
            edit any answer.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-800 font-medium text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
            {questions.map((question, idx) => (
              <div key={question.id} className="border-b border-slate-200 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 mb-1">
                      {idx + 1}. {question.question}
                    </p>
                    <p className="text-sm text-blue-600">
                      {question.options.find(
                        (opt) => opt.value === answers[question.id]?.value
                      )?.label || "Not answered"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onPrevious}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Questions
            </button>
            <button
              onClick={onSubmit}
              disabled={
                loading || Object.keys(answers).length < questions.length
              }
              className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-all shadow-sm ${
                loading || Object.keys(answers).length < questions.length
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Submit Assessment
                  <CheckCircle className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
