import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import SiteLayout from "@/components/SiteLayout";
import { mockDiamonds } from "@/data/mockCatalog";

type ImportRow = {
  stoneId: string;
  shape: string;
  carats: number;
  color: string;
  clarity: string;
  cut: string;
  price: number;
  certNumber: string;
  videoLink?: string;
};

const mapRow = (row: Record<string, unknown>): ImportRow => ({
  stoneId: String(row["Stone ID"] ?? "").trim(),
  shape: String(row["Shape"] ?? "").trim(),
  carats: Number(row["Carats"] ?? 0),
  color: String(row["Color"] ?? "").trim(),
  clarity: String(row["Clarity"] ?? "").trim(),
  cut: String(row["Cut"] ?? "").trim(),
  price: Number(row["Price"] ?? 0),
  certNumber: String(row["Certificate number"] ?? "").trim(),
  videoLink: String(row["Video link"] ?? "").trim() || undefined,
});

const AdminImport = () => {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const existingIds = useMemo(() => new Set(mockDiamonds.map((d) => d.stoneId)), []);

  const onFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
    const parsed = json.map(mapRow);

    const local = new Set<string>();
    const validationErrors: string[] = [];

    parsed.forEach((row, idx) => {
      if (!row.stoneId || !row.shape || !row.color || !row.clarity || !row.cut || !row.certNumber) {
        validationErrors.push(`Row ${idx + 2}: missing required fields`);
      }
      if (existingIds.has(row.stoneId)) {
        validationErrors.push(`Row ${idx + 2}: duplicate stone ID against inventory (${row.stoneId})`);
      }
      if (local.has(row.stoneId)) {
        validationErrors.push(`Row ${idx + 2}: duplicate stone ID in upload (${row.stoneId})`);
      }
      local.add(row.stoneId);
    });

    setRows(parsed);
    setErrors(validationErrors);
  };

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 space-y-6">
        <h1 className="font-heading text-3xl">Excel Diamond Import</h1>
        <p className="text-muted-foreground">Upload Excel, parse with SheetJS, validate rows, and block duplicate stone IDs.</p>

        <label className="block rounded-[12px] border-2 border-dashed border-border p-8 text-center bg-secondary/30 cursor-pointer">
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          <span className="text-sm uppercase tracking-[0.12em]">Upload Excel File</span>
        </label>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-[12px] border border-border p-5">
            <h2 className="font-heading text-xl mb-3">Validation</h2>
            <p className="text-sm text-muted-foreground mb-2">Rows parsed: {rows.length}</p>
            <p className="text-sm text-muted-foreground mb-3">Errors: {errors.length}</p>
            <ul className="space-y-1 text-sm">
              {errors.slice(0, 12).map((err) => <li key={err} className="text-destructive">• {err}</li>)}
            </ul>
          </div>

          <div className="rounded-[12px] border border-border p-5">
            <h2 className="font-heading text-xl mb-3">Preview</h2>
            <div className="space-y-2 text-sm max-h-[280px] overflow-auto">
              {rows.slice(0, 10).map((row) => (
                <div key={`${row.stoneId}-${row.certNumber}`} className="p-2 rounded bg-secondary/40">
                  {row.stoneId} • {row.shape} • {row.carats}ct • {row.color}/{row.clarity}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default AdminImport;
