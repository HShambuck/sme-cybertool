import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Search,
  ChevronRight,
  Play,
  CheckCircle,
  Star,
  Users,
  Target,
  Zap,
  GraduationCap,
} from "lucide-react";
import { getAllModules } from "../../services/training";
import { getAssessmentLinkedModules } from "../../services/recommendations";

const TrainingModules = ({ setCurrentView, onSelectModule }) => {
  const [modules, setModules] = useState([]);
  const [recommendedModules, setRecommendedModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const categories = [
    { value: "", label: "All Nodes", icon: Target },
    { value: "security_measure", label: "Security" },
    { value: "data_protection", label: "Data Protection" },
    { value: "technical", label: "Technical" },
    { value: "training", label: "Training" },
    { value: "policy", label: "Policy" },
  ];

  useEffect(() => {
    fetchModules();
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  // Fetch recommended modules once (not re-fetched on filter change)
  useEffect(() => {
    fetchRecommended();
  }, []);

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
      setError("Terminal Connection Failed: Unable to load modules.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      // Uses assessment's recommendationIds → relatedTrainingModuleId
      // so these are modules specifically flagged by the user's risk assessment
      const data = await getAssessmentLinkedModules();
      setRecommendedModules(data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch assessment-linked modules:", err);
      // Leave recommendedModules empty — section simply won't render
    }
  };

  const getDifficultyStyles = (diff) => {
    switch (diff) {
      case "beginner":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "intermediate":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "advanced":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  // ── Module Card ────────────────────────────────────────────────────────────
  const ModuleCard = ({ module, isRecommended = false }) => {
    const progress = module.userProgress?.progress || 0;
    const status = module.userProgress?.status || "not_started";

    return (
      <div
        onClick={() => onSelectModule(module._id)}
        className={`group relative bg-[#0F172A] rounded-[32px] border transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
          isRecommended
            ? "border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
            : "border-slate-800/50 shadow-xl"
        } hover:border-blue-500/50`}
      >
        {/* Recommended badge */}
        {isRecommended && (
          <div className="absolute -top-3 left-8 z-20">
            <div className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center shadow-lg">
              <Zap className="h-3 w-3 mr-1.5 fill-white" /> From Your Assessment
            </div>
          </div>
        )}

        {/* Completed tick */}
        {status === "completed" && (
          <div className="absolute top-6 right-6 z-10">
            <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        )}

        <div className="p-8 space-y-6">
          {/* Difficulty & Rating */}
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getDifficultyStyles(module.difficulty)}`}
            >
              {module.difficulty}
            </span>
            {module.averageRating > 0 && (
              <div className="flex items-center text-amber-500 space-x-1">
                <Star className="h-3 w-3 fill-amber-500" />
                <span className="text-[10px] font-black">
                  {module.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-xl font-black text-white leading-tight mb-2 group-hover:text-blue-500 transition-colors tracking-tight">
              {module.title}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">
              {module.description}
            </p>
          </div>

          {/* Progress bar */}
          {status !== "not_started" && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-600">
                  {status.replace("_", " ")}
                </span>
                <span className="text-blue-500">{progress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
            <div className="flex items-center space-x-4 text-slate-500">
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                <Clock className="h-3.5 w-3.5 mr-1.5" />{" "}
                {module.estimatedDuration}M
              </div>
              {module.completionCount > 0 && (
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                  <Users className="h-3.5 w-3.5 mr-1.5" />{" "}
                  {module.completionCount}
                </div>
              )}
            </div>
            <button
              className={`p-3 rounded-2xl transition-all ${
                status === "completed"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:bg-blue-500"
              }`}
            >
              {status === "in_progress" ? (
                <Play className="h-4 w-4 fill-white" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-[3px] border-slate-800 border-t-blue-500 animate-spin" />
          <GraduationCap className="h-6 w-6 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="mt-8 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
          Syncing Academy Nodes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#0F172A] border border-slate-800/50 rounded-[40px] p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 text-blue-500">
              <Zap className="h-5 w-5 fill-blue-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                SME Academy v2.4
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Knowledge <br />{" "}
              <span className="text-blue-500 italic">Defense Nodes</span>
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Modules
              </p>
              <p className="text-3xl font-black text-white">{modules.length}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Rank
              </p>
              <p className="text-3xl font-black text-blue-500 italic">PRO</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RECOMMENDED FROM ASSESSMENT ────────────────────────────────────── */}
      {recommendedModules.length > 0 && !selectedCategory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-1 bg-amber-500 rounded-full" />
              <h2 className="text-lg font-black text-white uppercase tracking-widest">
                Recommended Priority
              </h2>
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Linked to your risk assessment results
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

      {/* If no assessment recommendations exist, prompt user */}
      {recommendedModules.length === 0 && !selectedCategory && (
        <div className="border border-dashed border-amber-500/20 rounded-[32px] p-8 flex items-center justify-between bg-amber-500/5">
          <div>
            <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">
              No Assessment Found
            </p>
            <p className="text-slate-500 text-xs">
              Complete a risk assessment to get personalised module
              recommendations.
            </p>
          </div>
          <button
            onClick={() => setCurrentView("assessment")}
            className="shrink-0 ml-6 bg-amber-500 hover:bg-amber-400 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all"
          >
            Start Assessment
          </button>
        </div>
      )}

      {/* ── FILTER BAR ─────────────────────────────────────────────────────── */}
      <div className="bg-[#0F172A] border border-slate-800/50 rounded-[32px] p-4 flex flex-col lg:flex-row items-center gap-4 sticky top-24 z-30 shadow-2xl backdrop-blur-md">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Security Library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                selectedCategory === cat.value
                  ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
                  : "bg-slate-900/50 text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── ALL NODES GRID ──────────────────────────────────────────────────── */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-1 bg-blue-600 rounded-full" />
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Available Nodes
            </h2>
          </div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-transparent text-slate-500 font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer hover:text-blue-500"
          >
            <option value="">Filter Difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {modules.length === 0 ? (
          <div className="py-20 text-center bg-[#0F172A] border border-slate-800 border-dashed rounded-[40px]">
            <BookOpen className="h-12 w-12 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-600 font-black uppercase tracking-widest text-xs">
              No Nodes Found matching search parameters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module) => (
              <ModuleCard key={module._id} module={module} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingModules;
