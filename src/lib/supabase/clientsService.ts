import { supabase } from "@/integrations/supabase/client";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string;
  status?: "active" | "inactive";
}

export interface GetClientsParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "active" | "inactive" | "all";
}

export const getClients = async ({
  page = 1,
  perPage = 10,
  search = "",
  status = "all",
}: GetClientsParams = {}) => {
  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // Apply search filter
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  // Apply status filter
  if (status !== "all") {
    query = query.eq("status", status);
  }

  // Apply pagination
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data as Client[],
    count: count || 0,
    page,
    perPage,
    totalPages: count ? Math.ceil(count / perPage) : 0,
  };
};

export const createClient = async (clientData: CreateClientData) => {
  const { data, error } = await supabase
    .from("clients")
    .insert([clientData])
    .select()
    .single();

  if (error) throw error;
  return data as Client;
};

export const updateClient = async (id: string, clientData: UpdateClientData) => {
  const { data, error } = await supabase
    .from("clients")
    .update(clientData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Client;
};

export const toggleClientStatus = async (id: string, currentStatus: "active" | "inactive") => {
  const newStatus = currentStatus === "active" ? "inactive" : "active";
  return updateClient(id, { status: newStatus });
};

export const deleteClient = async (id: string) => {
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) throw error;
};
