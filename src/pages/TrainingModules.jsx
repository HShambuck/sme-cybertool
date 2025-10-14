// pages/TrainingModules.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Award,
  Search,
  Filter,
  ChevronRight,
  Play,
  CheckCircle,
  TrendingUp,
  Home,
  Star,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { getAllModules, getRecommendedModules } from "../services/training";

const TrainingModules = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [recommendedModules, setRecommendedModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const categories = [
    { value: "", label: "All Categories", icon: Target },
    { value: "security_measure", label: "Security Measures", color: "blue" },
    { value: "data_protection", label: "Data Protection", color: "green" },
    { value: "technical", label: "Technical", color: "purple" },
    { value: "training", label: "Security Training", color: "orange" },
    { value: "policy", label: "Policy", color: "indigo" },
    { value: "physical_security", label: "Physical Security", color: "red" },
    { value: "device_security", label: "Device Security", color: "pink" },
    { value: "vendor", label: "Vendor Management", color: "teal" },
  ];

  const difficulties = [
    { value: "", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  useEffect(() => {
    fetchModules();
    fetchRecommended();
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await getAllModules({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        search: searchTerm,
      });
      setModules(data);
    } catch (err) {
      setError("Failed to load training modules");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      const data = await getRecommendedModules();
      setRecommendedModules(data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch recommended modules:", err);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "intermediate":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "advanced":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return "bg-slate-300";
    if (progress < 50) return "bg-gradient-to-r from-amber-400 to-amber-500";
    if (progress < 100) return "bg-gradient-to-r from-blue-500 to-blue-600";
    return "bg-gradient-to-r from-emerald-500 to-emerald-600";
  };

  const ModuleCard = ({ module, isRecommended = false }) => {
    const progress = module.userProgress?.progress || 0;
    const status = module.userProgress?.status || "not_started";

    return (
      <div
        className={`bg-white rounded-xl shadow-sm border ${
          isRecommended
            ? "border-orange-200 ring-2 ring-orange-200"
            : "border-slate-200"
        } hover:shadow-md transition-all cursor-pointer`}
        onClick={() => navigate(`/training/${module._id}`)}
      >
        {isRecommended && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              Recommended
            </div>
          </div>
        )}

        {/* Status Badge */}
        {status === "completed" && (
          <div className="absolute -top-3 -right-3 z-10">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-2 rounded-full shadow-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {module.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-3">
              {module.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getDifficultyColor(
                module.difficulty
              )}`}
            >
              {module.difficulty.charAt(0).toUpperCase() +
                module.difficulty.slice(1)}
            </span>
            <span className="flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {module.estimatedDuration} min
            </span>
            {module.completionCount > 0 && (
              <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                {module.completionCount} completed
              </span>
            )}
            {module.averageRating > 0 && (
              <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                <Star className="h-3.5 w-3.5 mr-1.5 fill-amber-400" />
                {module.averageRating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {status !== "not_started" && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span className="capitalize">{status.replace("_", " ")}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(
                    progress
                  )}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-slate-100">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              {module.content?.steps && (
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {module.content.steps.length} steps
                </span>
              )}
              {module.quiz?.questions && (
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Quiz
                </span>
              )}
            </div>
            <button className="flex items-center text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-lg transition-all shadow-md group-hover:shadow-lg">
              {status === "completed" ? (
                <>
                  Review
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : status === "in_progress" ? (
                <>
                  Continue
                  <Play className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Start
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-700 font-semibold text-lg">
                Loading training modules...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
            Training Modules
          </h1>
          <p className="text-slate-600 text-lg">
            Master cybersecurity with our expert-curated training programs
          </p>
        </div> */}

        {/* Recommended Section */}
        {recommendedModules.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-xl shadow-lg mr-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recommended for You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedModules.map((module) => (
                <ModuleCard
                  key={module._id}
                  module={module}
                  isRecommended={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-white p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white font-medium cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white font-medium cursor-pointer"
              >
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* All Modules */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <BookOpen className="h-7 w-7 mr-2 text-blue-600" />
            All Modules
            <span className="ml-3 text-lg font-normal text-slate-500">
              ({modules.length})
            </span>
          </h2>
          {modules.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-slate-200 p-16 text-center">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-medium">
                No modules found matching your criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <ModuleCard key={module._id} module={module} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingModules;
