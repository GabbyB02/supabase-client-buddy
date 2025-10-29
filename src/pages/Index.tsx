import { useState } from "react";
import { useClients } from "@/hooks/useClients";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { ClientsPagination } from "@/components/clients/ClientsPagination";
import { Users } from "lucide-react";
const Index = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const {
    data,
    isLoading
  } = useClients({
    page,
    perPage: 10,
    search,
    status
  });
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          </div>
          <p className="text-muted-foreground">Administra y organiza la información de clientes</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <ClientsFilters search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />
            <CreateClientDialog />
          </div>

          <ClientsTable clients={data?.data || []} isLoading={isLoading} />

          {data && <ClientsPagination currentPage={data.page} totalPages={data.totalPages} onPageChange={setPage} totalClients={data.count} />}
        </div>
      </div>
    </div>;
};
export default Index;