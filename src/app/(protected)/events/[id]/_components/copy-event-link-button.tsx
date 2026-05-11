"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CopyEventLinkButtonProps {
  eventId: string;
}

const CopyEventLinkButton = ({ eventId }: CopyEventLinkButtonProps) => {
  const handleCopyLink = async () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/e/${eventId}`;

    await navigator.clipboard.writeText(url);

    toast.success("Link copiado com sucesso.");
  };

  return (
    <Button variant="outline" onClick={handleCopyLink}>
      <Copy className="mr-2 h-4 w-4" />
      Copiar link
    </Button>
  );
};

export default CopyEventLinkButton;
