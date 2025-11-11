import React from "react";
import { Badge } from "@/components/ui/badge";

const NovaBadge = ({ novaGroup, size = "md" }) => {
  if (!novaGroup) return null;

  const styles = {
    1: "bg-green-100 text-green-800 border-green-300",
    2: "bg-blue-100 text-blue-800 border-blue-300",
    3: "bg-yellow-100 text-yellow-800 border-yellow-300",
    4: "bg-red-100 text-red-800 border-red-300", // brighter and clear red
  };

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3 py-1"
      : "text-xs px-2 py-0.5";

  return (
    <Badge
      className={`${styles[novaGroup] || "bg-gray-100 text-gray-800 border-gray-300"} 
        border font-medium rounded-full ${sizeClasses}`}
    >
      NOVA {novaGroup}
    </Badge>
  );
};

export default NovaBadge;
