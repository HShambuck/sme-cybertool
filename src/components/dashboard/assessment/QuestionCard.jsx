import React from "react";

const QuestionCard = ({ question, questionNumber, answer, onAnswerChange }) => {
  return (
    <div className="border-b border-slate-200 pb-8 last:border-b-0 last:pb-0">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-blue-700 font-bold text-sm">
            {questionNumber}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {question.domain}
            </span>
          </div>
          <label className="text-lg font-semibold text-slate-900">
            {question.question}
          </label>
        </div>
      </div>

      <div className="ml-11 space-y-2">
        {question.options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
              answer?.value === option.value
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={answer?.value === option.value}
              onChange={() =>
                onAnswerChange(question.id, option.value, option.scoreImpact)
              }
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-slate-700 font-medium">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
