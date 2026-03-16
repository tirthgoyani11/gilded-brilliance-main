import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import SiteLayout from "@/components/SiteLayout";
import { mockDiamonds } from "@/data/mockCatalog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
import type { Diamond } from "@/types/diamond";

type ImportRow = {
  imagePath: string;
  type: string;
  branch: string;
  stoneId: string;
  shape: string;
  carats: number;
  color: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  price: number;
  certNumber: string;
  length: number;
  width: number;
  height: number;
  tablePct: number;
  depthPct: number;
  girdlePct: number;
  ratio: number;
  certificateLink?: string;
  videoLink?: string;
};

type RowResult = {
  rowNumber: number;
  row: ImportRow;
  errors: string[];
};

const csvHeaders = [
  "Image path",
  "Type",
  "Branch",
  "Stone ID",
  "Shape",
  "Carats",
  "Color",
  "Clarity",
  "Cut",
  "Polish",
  "Symmetry",
  "Price",
  "Certificate number",
  "Length",
  "Width",
  "Height",
  "Table %",
  "Depth %",
  "Girdle %",
  "Ratio",
  "Certificate link",
  "Video link",
];

const safeNumber = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const mapRow = (row: Record<string, unknown>): ImportRow => ({
  imagePath: String(row["Image path"] ?? "").trim(),
  type: String(row["Type"] ?? "").trim(),
  branch: String(row["Branch"] ?? "").trim(),
  stoneId: String(row["Stone ID"] ?? "").trim(),
  shape: String(row["Shape"] ?? "").trim(),
  carats: safeNumber(row["Carats"]),
  color: String(row["Color"] ?? "").trim(),
  clarity: String(row["Clarity"] ?? "").trim(),
  cut: String(row["Cut"] ?? "").trim(),
  polish: String(row["Polish"] ?? "").trim(),
  symmetry: String(row["Symmetry"] ?? "").trim(),
  price: safeNumber(row["Price"]),
  certNumber: String(row["Certificate number"] ?? "").trim(),
  length: safeNumber(row["Length"]),
  width: safeNumber(row["Width"]),
  height: safeNumber(row["Height"]),
  tablePct: safeNumber(row["Table %"]),
  depthPct: safeNumber(row["Depth %"]),
  girdlePct: safeNumber(row["Girdle %"]),
  ratio: safeNumber(row["Ratio"]),
  certificateLink: String(row["Certificate link"] ?? "").trim() || undefined,
  videoLink: String(row["Video link"] ?? "").trim() || undefined,
});

const AdminImport = () => {
  const { diamonds, importDiamonds } = useStore();
  const [results, setResults] = useState<RowResult[]>([]);
  const [importedCount, setImportedCount] = useState(0);

  const existingIds = useMemo(() => new Set(diamonds.map((d) => d.stoneId)), [diamonds]);

  const validationSummary = useMemo(() => {
    const valid = results.filter((item) => item.errors.length === 0);
    const invalid = results.filter((item) => item.errors.length > 0);
    return { valid, invalid };
  }, [results]);

  const buildTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      csvHeaders,
      [
        "https://cdn.example.com/diamond-001.jpg",
        "natural",
        "NY",
        "VMR-2001",
        "Round",
        1.1,
        "F",
        "VS1",
        "Excellent",
        "Excellent",
        "Excellent",
        6200,
        "IGI-VMR2001",
        6.7,
        6.6,
        4.1,
        58,
        62.1,
        3.2,
        1.02,
        "https://www.igi.org/verify-your-report/?r=IGI-VMR2001",
        "https://cdn.example.com/video-001.mp4",
      ],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "diamonds");
    XLSX.writeFile(wb, "vmora_diamond_import_template.xlsx");
  };

  const validateRow = (row: ImportRow, rowNumber: number, localIds: Set<string>) => {
    const errors: string[] = [];

    if (!row.stoneId) errors.push("Stone ID is required");
    if (!row.shape) errors.push("Shape is required");
    if (!row.color) errors.push("Color is required");
    if (!row.clarity) errors.push("Clarity is required");
    if (!row.cut) errors.push("Cut is required");
    if (!row.polish) errors.push("Polish is required");
    if (!row.symmetry) errors.push("Symmetry is required");
    if (!row.certNumber) errors.push("Certificate number is required");
    if (row.carats <= 0) errors.push("Carats must be greater than 0");
    if (row.price <= 0) errors.push("Price must be greater than 0");
    if (row.depthPct <= 0) errors.push("Depth % must be greater than 0");
    if (row.tablePct <= 0) errors.push("Table % must be greater than 0");

    if (existingIds.has(row.stoneId)) {
      errors.push(`Duplicate stone ID against inventory (${row.stoneId})`);
    }
    if (localIds.has(row.stoneId)) {
      errors.push(`Duplicate stone ID in upload (${row.stoneId})`);
    }

    localIds.add(row.stoneId);

    return {
      rowNumber,
      row,
      errors,
    };
  };

  const onFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
    const parsed = json.map(mapRow);

    const localIds = new Set<string>();
    const nextResults = parsed.map((row, idx) => validateRow(row, idx + 2, localIds));

    setResults(nextResults);
    setImportedCount(0);
  };

  const importValidRows = () => {
    const validDiamonds: Diamond[] = validationSummary.valid.map(({ row }) => {
      const certLab = row.certNumber.toUpperCase().startsWith("GIA") ? "GIA" : "IGI";
      const labType = row.type === "lab-grown" ? "lab-grown" : "natural";
      const imageUrl = row.imagePath || mockDiamonds[0].imageUrl;

      return {
        stoneId: row.stoneId,
        type: labType,
        shape: row.shape,
        carat: row.carats,
        color: row.color,
        clarity: row.clarity,
        cut: row.cut,
        polish: row.polish,
        symmetry: row.symmetry,
        fluorescence: "None",
        price: row.price,
        ratio: row.ratio || 1,
        depthPct: row.depthPct,
        tablePct: row.tablePct,
        measurements: `${row.length} x ${row.width} x ${row.height}`,
        certLab,
        certNumber: row.certNumber,
        certLink: row.certificateLink,
        imageUrl,
        videoUrl: row.videoLink,
        v360StoneId: row.stoneId,
      };
    });

    importDiamonds(validDiamonds);
    setImportedCount(validDiamonds.length);
  };

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl">Excel Diamond Import</h1>
            <p className="text-muted-foreground">Upload Excel, parse with SheetJS, validate rows, prevent duplicate Stone IDs, and stage import.</p>
          </div>
          <Button variant="luxury-outline" onClick={buildTemplate}>Download Template</Button>
        </div>

        <label className="block rounded-[12px] border-2 border-dashed border-border p-8 text-center bg-secondary/30 cursor-pointer">
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          <span className="text-sm uppercase tracking-[0.12em]">Upload Excel File</span>
        </label>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-[12px] border border-border p-5">
            <h2 className="font-heading text-xl mb-3">Validation</h2>
            <p className="text-sm text-muted-foreground mb-2">Rows parsed: {results.length}</p>
            <p className="text-sm text-muted-foreground mb-2">Valid rows: {validationSummary.valid.length}</p>
            <p className="text-sm text-muted-foreground mb-3">Invalid rows: {validationSummary.invalid.length}</p>
            <ul className="space-y-1 text-sm max-h-[240px] overflow-auto">
              {validationSummary.invalid.slice(0, 12).map((item) => (
                <li key={`${item.rowNumber}-${item.row.stoneId}`} className="text-destructive">
                  • Row {item.rowNumber}: {item.errors.join(", ")}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={importValidRows} disabled={validationSummary.valid.length === 0}>
                Import Valid Rows
              </Button>
              {importedCount > 0 ? (
                <p className="text-sm text-primary">Imported {importedCount} row(s) successfully (simulated).</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[12px] border border-border p-5">
            <h2 className="font-heading text-xl mb-3">Preview</h2>
            <div className="space-y-2 text-sm max-h-[280px] overflow-auto">
              {results.slice(0, 10).map(({ row, rowNumber, errors }) => (
                <div key={`${rowNumber}-${row.stoneId}-${row.certNumber}`} className="p-2 rounded bg-secondary/40">
                  <p>
                    Row {rowNumber}: {row.stoneId} • {row.shape} • {row.carats}ct • {row.color}/{row.clarity} • ${row.price}
                  </p>
                  <p className={`text-xs ${errors.length ? "text-destructive" : "text-primary"}`}>
                    {errors.length ? `Invalid: ${errors.join(", ")}` : "Valid"}
                  </p>
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
