import { LoaderPinwheel } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center text-primary-dark animate-spin">
      <LoaderPinwheel strokeWidth={1} size={64} className=""></LoaderPinwheel>
    </div>
  );
}
