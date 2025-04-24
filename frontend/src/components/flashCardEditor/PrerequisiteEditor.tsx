import React, { useState } from "react";
import { PrerequisitesForm } from "./PrerequisitesForm";
import { Prerequisite } from "@/models/models";
import { EditorProps } from "./FlashCardDialog";
import EditIcon from "../common/EditIcon";
import useTreeStore from "@/stores/useTreeStore";

const PrerequisiteEditor: React.FC<EditorProps> = ({ dekuSetId }) => {
  const dekuSet = useTreeStore((state) =>
      state.dekuSets[dekuSetId]
  );
  if (!dekuSet) {
    return <div>Loading prerequisites…</div>;
  }
  const [isPrerequisitesEditable, setIsPrerequisitesEditable] = useState(false);
  //TODO Make prereq hyperlinks clickable

  const handleSave = (data: Prerequisite[]) => {
    // TODO use Service
    //setCardSet({ ...cardSet, prerequisites: data });
    setIsPrerequisitesEditable(false);
  };

  const handleCancel = () => {
    setIsPrerequisitesEditable(false);
  };

  return (
    <>
      {isPrerequisitesEditable ? (
        <div className="mx-5 mb-4 p-4">
          <h3 className="font-semibold">Prerequisites</h3>
          <PrerequisitesForm
            initialData={dekuSet.prerequisites}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>
      ) : (
        <EditIcon>
          <div
            className="mx-5 mb-4 cursor-text p-4 hover:bg-muted"
            onClick={() => setIsPrerequisitesEditable(true)}
          >
            <h3 className="mb-4 font-semibold">Prerequisites</h3>
            {dekuSet.prerequisites.length == 0 ? (
              <div className="ml-3 text-sm italic text-muted-foreground">
                {"None"}
              </div>
            ) : (
              <></>
            )}
            <ul className="ml-3 list-disc pl-5">
              {dekuSet.prerequisites.map((prereq, index) => (
                <li key={index} className="text-sm">
                  {prereq.name}
                </li>
              ))}
            </ul>
          </div>
        </EditIcon>
      )}
    </>
  );
};

export default PrerequisiteEditor;
