import { supabaseClient } from "./supabase";

export interface IGuest {
  name: string;
  familyId: number;
  id: number;
  check: boolean;
}

export const supabaseServices = {
  getGuests: async (familyId: number): Promise<IGuest[]> => {
    const { data, error } = await supabaseClient
      .from("guests")
      .select("*")
      .eq("familyId", familyId);

    if (error) throw new Error(error.message);

    return data;
  },

  checkGuest: async (guestId: number, check: boolean): Promise<boolean> => {
    const { error } = await supabaseClient
      .from("guests")
      .update({ check: check })
      .eq("id", guestId);

    if (error) throw new Error(error.message);

    return true;
  },
};
