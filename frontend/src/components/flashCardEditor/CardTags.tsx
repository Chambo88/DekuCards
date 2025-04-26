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
import useTreeStore from "@/stores/useTreeStore";
import useSetService from "@/services/useSetService";

interface CardTagsProps extends EditorProps {
  card: FlashCard;
}

interface TagProps {
  icon: React.ReactNode;
  onClick?: () => void;
  tooltip: string;
}

const CardTags: React.FC<CardTagsProps> = ({ card, dekuSetId }) => {
  const updateCard = useTreeStore((state) => state.updateCard);
  const deleteCards = useTreeStore((state) => state.deleteCards);
  const { updateCardDB } = useSetService();


  const handleSelect = async () => {
    updateCard(dekuSetId, card.id, { selected: !card.selected });
    await updateCardDB(card.id, dekuSetId);
  };

  const handleEnable = async () => {
    updateCard(dekuSetId, card.id, { enabled: !card.enabled });
    await updateCardDB(card.id, dekuSetId);
  };

  const handleDelete = async () => {
    deleteCards(dekuSetId, new Set([card.id]));
    await updateCardDB(card.id, dekuSetId);
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
        <TooltipTrigger tabIndex={-1}>
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
