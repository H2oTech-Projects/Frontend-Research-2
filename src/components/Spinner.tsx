import { Loader } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader className="w-6 h-6 animate-spin text-blue-500 dark:text-white" />
    </div>
  );
};

export default Spinner;