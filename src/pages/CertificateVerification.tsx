import { useMemo, useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { mockDiamonds } from "@/data/mockCatalog";
import { certificateLink } from "@/lib/diamond-utils";

const CertificateVerification = () => {
  const [certNo, setCertNo] = useState("");

  const match = useMemo(
    () => mockDiamonds.find((d) => d.certNumber.toLowerCase() === certNo.trim().toLowerCase()),
    [certNo],
  );

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 max-w-3xl">
        <h1 className="font-heading text-3xl mb-2">Certificate Verification</h1>
        <p className="text-muted-foreground mb-6">Verify IGI/GIA certificate numbers and access report links.</p>

        <input
          className="h-11 w-full rounded border border-border px-3"
          placeholder="Enter certificate number"
          value={certNo}
          onChange={(e) => setCertNo(e.target.value)}
        />

        <div className="mt-6 rounded-[12px] border border-border p-5 bg-secondary/30">
          {match ? (
            <div className="space-y-2">
              <p className="font-medium">Match Found: {match.stoneId}</p>
              <p className="text-sm text-muted-foreground">Lab: {match.certLab} • Certificate: {match.certNumber}</p>
              <a href={certificateLink(match)} className="text-primary underline" target="_blank" rel="noreferrer">Open Verification Link</a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No matching record found in current inventory.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default CertificateVerification;
