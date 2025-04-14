import React, { useRef, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { DekuSet, FlashCard, createFlashCard, createSetModel } from "@/models/models";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "../ui/textarea";
import {
  AI_PROMPT,
  JSON_HINT_FORMAT,
  MAX_FLASHCARD_CHAR,
  MAX_FLASHCARD_IN_NODE,
  MAX_JSON_CHAR,
} from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import useNodeStore from "@/stores/useTreeStore";

interface JsonDialogProps {
  children: React.ReactNode;
  dekuSetId: string;
}

type InputFlashCard = {
  front: string;
  back: string;
};

const flashCardSchema = z.object({
  front: z.string().min(1).max(MAX_FLASHCARD_CHAR),
  back: z.string().min(1).max(MAX_FLASHCARD_CHAR),
});

const flashCardsSchema = z.array(flashCardSchema).max(MAX_FLASHCARD_IN_NODE);

const JsonDialog: React.FC<JsonDialogProps> = ({
  children,
  dekuSetId,
}) => {
  const dekuSet = useNodeStore((state) =>
      state.dekuSets[dekuSetId]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const addCards = useNodeStore((state) => state.addCards);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    try {
      const parsedData: InputFlashCard[] = JSON.parse(jsonInput);
      flashCardsSchema.parse(parsedData);

      const cardsLength = Object.keys(useNodeStore.getState().setToCards[dekuSet.id]).length;

      if (parsedData.length + cardsLength > MAX_FLASHCARD_IN_NODE) {
        toast({
          variant: "destructive",
          title: "Uh oh! Card limit reached",
          description: `Card limit per node is ${MAX_FLASHCARD_IN_NODE}, `,
        });
        return;
      }

      const newFlashCards: Record<string, FlashCard> = parsedData.reduce((acc, val: InputFlashCard) => {
        const card = createFlashCard({ set_id: dekuSet.id, front: val.front, back: val.back });
        acc[card.id] = card;
        return acc;
      }, {} as Record<string, FlashCard>);
      

      addCards(dekuSet.id, newFlashCards);

      setIsOpen(false);
    } catch (error) {
      setErrorMessage("Invalid JSON format or data structure.");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const onTextChange = (e: any) => {
    setJsonInput(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="flex h-5/6 max-w-[800px] flex-col"
      >
        <DialogTitle>
          <div className="mx-6 mb-2 mt-6 flex items-center justify-between">
            <div>Add Cards via AI/JSON</div>{" "}
            <div className="flex items-center">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <QuestionMarkCircleIcon className="mr-2 h-5 w-5 cursor-default" />
                  </TooltipTrigger>
                  <TooltipContent side="left" align="center">
                    <p className="text-sm font-normal">
                      Paste the prompt into an AI of choice {"(e.g. ChatGPT)"}.
                      <br />
                      Add your content and change the NUM_OF_CARDS.
                      <br />
                      Copy and paste the result here.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CopyButton />
            </div>
          </div>
        </DialogTitle>
        {errorMessage && (
          <div className="mx-6 text-sm text-red-500">{errorMessage}</div>
        )}
        <div className="flex-grow px-6 py-3">
          <Textarea
            className="h-full resize-none scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary"
            ref={textareaRef}
            value={jsonInput}
            onChange={onTextChange}
            placeholder={JSON_HINT_FORMAT}
            autoFocus
            maxLength={MAX_JSON_CHAR}
          />
        </div>

        <DialogFooter className="border-t bg-background p-4 shadow-lg">
          <Button onClick={handleSave}>Add JSON cards</Button>
          <Button variant="secondary" onClick={handleCancel} className="ml-2">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CopyButton: React.FC = () => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT);
      toast({
        description: "Copied prompt to clipboard.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong copying AI Prompt.",
        description: `Error: ${err.message}`,
      });
    }
  };

  return (
    <Button onClick={handleCopy} variant="secondary">
      <Copy className="mr-2 h-4 w-4" />
      Copy AI prompt
    </Button>
  );
};

export default JsonDialog;
