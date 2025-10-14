import React from "react";
import { Shield, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

const IntroPage = ({ onNext, onCancel }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-10">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="h-10 w-10 text-blue-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 text-center mb-4">
          Cybersecurity Risk Assessment
        </h1>

        <p className="text-slate-600 text-center mb-8">
          Take this comprehensive assessment to evaluate your business's
          security posture. This will take approximately 15-20 minutes to
          complete.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="text-slate-700">
              <strong>35 questions</strong> covering 10 critical security
              domains
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="text-slate-700">
              Receive a <strong>personalized risk score</strong> and detailed
              recommendations
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="text-slate-700">
              <strong>AI-powered insights</strong> tailored to your business
              needs
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              Answer honestly for the most accurate assessment. All responses
              are confidential and used only to generate your security
              recommendations.
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center justify-center cursor-pointer ease-in shadow-sm"
          >
            Start Assessment
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
