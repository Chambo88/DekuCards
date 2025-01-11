import { useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";

const prerequisiteSchema = z.object({
  name: z.string().nonempty("Name is required"),
  link: z.string().optional(),
});

const formSchema = z.object({
  prerequisites: z.array(prerequisiteSchema),
});

type Prerequisite = z.infer<typeof prerequisiteSchema>;

interface PrerequisitesFormProps {
  initialData: Prerequisite[];
  onSave: (data: Prerequisite[]) => void;
  onCancel: () => void;
}

export function PrerequisitesForm({
  initialData,
  onSave,
  onCancel,
}: PrerequisitesFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prerequisites: initialData.length ? initialData : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prerequisites",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const filteredData = values.prerequisites.filter(
      (item) => item.name.trim() !== "" || item.link?.trim() !== "",
    );
    onSave(filteredData);
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <div className="flex space-x-2" key={field.id}>
              <FormField
                control={form.control}
                name={`prerequisites.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`prerequisites.${index}.link`}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input placeholder="Link (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <Trash className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => append({ name: "", link: "" })}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Prerequisite
            </Button>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button type="submit" className="w-20">
            Save
          </Button>
          <Button variant="secondary" className="w-20" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
