import { User as SupabaseUser } from "@supabase/supabase-js";
import { CardSet } from "./cardSet";

export interface User extends SupabaseUser {
  firstName: string;
  lastName?: string;
  cardSets: CardSet[];
}
