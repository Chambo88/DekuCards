import { memo } from "react";
import {
  CheckIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { FlashCard } from "@/models/models";
import { EditorProps } from "./FlashCardDialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import CancelConfirmDialog from "../common/CancelConfirmDialog";

interface CardTagsProps extends EditorProps {
  card: FlashCard;
}

interface TagProps {
  icon: React.ReactNode;
  onClick?: () => void;
  tooltip: string;
}

const CardTags: React.FC<CardTagsProps> = ({ setCardSet, card }) => {
  const handleSelect = () => {
    setCardSet((prevItems) => ({
      ...prevItems,
      cards: prevItems.cards.map((item) =>
        item.id === card.id ? { ...item, selected: !item.selected } : item,
      ),
    }));
  };

  const handleDelete = () => {
    setCardSet((prevItems) => ({
      ...prevItems,
      cards: prevItems.cards.filter((item) => item.id !== card.id),
    }));
  };

  const handleEnable = () => {
    setCardSet((prevItems) => ({
      ...prevItems,
      cards: prevItems.cards.map((item) =>
        item.id === card.id ? { ...item, enabled: !item.enabled } : item,
      ),
    }));
  };

  return (
    <>
      <Tag
        icon={
          card.selected ? (
            <CheckIcon className="h-5 w-5 rounded border border-primary bg-primary text-primary-foreground" />
          ) : (
            <div className="h-5 w-5 rounded border border-primary" />
          )
        }
        tooltip="Select"
        onClick={handleSelect}
      />

      <Tag
        icon={
          card.enabled ? (
            <EyeIcon className="h-6 w-6" />
          ) : (
            <EyeSlashIcon className="h-6 w-6" />
          )
        }
        tooltip="Enable/Disable"
        onClick={handleEnable}
      />

      <CancelConfirmDialog
        title="Delete"
        desc="Are you sure you want to remove this card?"
        primaryText="Confirm"
        destructive={true}
        confirm={handleDelete}
      >
        <Tag
          icon={<TrashIcon className="h-6 w-6 text-red-500" />}
          tooltip="Delete card"
        />
      </CancelConfirmDialog>
    </>
  );
};

const Tag: React.FC<TagProps> = ({ icon, tooltip, onClick }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger>
          <div
            onClick={onClick}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded bg-secondary text-secondary-foreground hover:bg-secondary/80`}
          >
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(CardTags);
