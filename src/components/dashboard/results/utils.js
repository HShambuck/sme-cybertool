// Utility function for risk level colors
export const getRiskColor = (level) => {
  switch (level) {
    case "LOW RISK":
      return {
        bg: "from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-800",
        badge: "bg-green-100 text-green-800",
        progress: "bg-green-500",
      };
    case "MEDIUM RISK":
      return {
        bg: "from-yellow-50 to-amber-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        badge: "bg-yellow-100 text-yellow-800",
        progress: "bg-yellow-500",
      };
    case "HIGH RISK":
      return {
        bg: "from-orange-50 to-red-50",
        border: "border-orange-200",
        text: "text-orange-800",
        badge: "bg-orange-100 text-orange-800",
        progress: "bg-orange-500",
      };
    case "CRITICAL RISK":
      return {
        bg: "from-red-50 to-rose-50",
        border: "border-red-200",
        text: "text-red-800",
        badge: "bg-red-100 text-red-800",
        progress: "bg-red-500",
      };
    default:
      return {
        bg: "from-blue-50 to-indigo-50",
        border: "border-blue-200",
        text: "text-blue-800",
        badge: "bg-blue-100 text-blue-800",
        progress: "bg-blue-500",
      };
  }
};
