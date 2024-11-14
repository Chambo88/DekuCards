import { User as SupabaseUser } from "@supabase/supabase-js";
import { FlashCardSet } from "./models";

export interface User extends SupabaseUser {
  firstName: string;
  lastName?: string;
  cardSets: FlashCardSet[];
}
