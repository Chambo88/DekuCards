import { PencilIcon } from "@heroicons/react/24/outline";

interface EditIconProps {
  children: React.ReactNode;
}

const EditIcon: React.FC<EditIconProps> = ({ children }) => {
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end opacity-0 transition-opacity duration-0 group-hover:opacity-100">
        <PencilIcon className="mr-8 h-5 w-5" />
      </div>
      {children}
    </div>
  );
};

export default EditIcon;
