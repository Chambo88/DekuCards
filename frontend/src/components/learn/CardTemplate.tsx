import { X } from "lucide-react";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import { ReactNode } from "react";

interface CardTemplateProps {
  children?: ReactNode;
}

const CardTemplate = ({ children }: CardTemplateProps) => {
  return (
    <div className="relative flex h-[600px] w-[700px] flex-col rounded-lg border-2 border-solid border-muted bg-background p-0 shadow-[5px_5px_20px_0px_rgba(0,0,0,0.5)]">
      <DialogClose asChild className="absolute right-0 top-0 z-[1010]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 text-muted-foreground"
        >
          <X size={20} />
        </Button>
      </DialogClose>
      {children}
    </div>
  );
};

export default CardTemplate;
