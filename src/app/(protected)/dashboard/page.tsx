import { Construction } from "lucide-react";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const DashboardPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>

          <PageDescription>
            Acompanhe as informações dos seus eventos
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full border">
            <Construction className="text-muted-foreground h-10 w-10" />
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight">
            Dashboard em construção
          </h2>

          <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
            Estamos preparando uma experiência completa para você acompanhar
            métricas, confirmações e informações dos seus eventos em tempo real.
          </p>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
