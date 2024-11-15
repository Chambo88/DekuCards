import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { EditorProps } from "./FlashCardDialog";
import EditIcon from "../common/EditIcon";

const DescriptionEditor: React.FC<EditorProps> = ({ cardSet, setCardSet }) => {
  const [isDescEditable, setIsDescEditable] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isDescEditable && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, [isDescEditable]);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCardSet({ ...cardSet, desc: e.target.value });
  };

  return (
    <>
      {isDescEditable ? (
        <div className="mx-8 mb-4">
          <Textarea
            ref={textareaRef}
            className="resize-none overflow-hidden"
            style={{ overflowWrap: "anywhere" }}
            value={cardSet.desc}
            onChange={(e) => {
              handleDescriptionChange(e);
              const textarea = e.target;
              textarea.style.height = "auto";
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            onBlur={() => setIsDescEditable(false)}
            placeholder="Description (optional)"
            autoFocus
            maxLength={1000}
          />
        </div>
      ) : (
        <EditIcon>
          <div
            className="mx-4 cursor-text text-wrap p-4 hover:bg-muted"
            style={{ overflowWrap: "anywhere" }}
            onClick={() => setIsDescEditable(true)}
          >
            <p className="px-4 text-sm">{cardSet.desc}</p>
          </div>
        </EditIcon>
      )}
    </>
  );
};

export default DescriptionEditor;
