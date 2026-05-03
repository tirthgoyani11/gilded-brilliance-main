import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dataDir = path.resolve(process.cwd(), ".local-data");
const dataFile = path.join(dataDir, "jewelry-items.json");

async function readItems() {
  try {
    const contents = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeItems(items) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
}

export async function listLocalJewelryItems({ activeOnly = false, category = "", inventoryStatus = "", search = "" } = {}) {
  const normalizedSearch = search.trim().toLowerCase();

  return (await readItems())
    .filter((item) => !activeOnly || item.isActive !== false)
    .filter((item) => !category || item.category === category)
    .filter((item) => !inventoryStatus || item.inventoryStatus === inventoryStatus)
    .filter((item) => {
      if (!normalizedSearch) return true;
      return [item.id, item.name, item.category, item.subcategory, item.metal, item.collection, item.tags]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    })
    .sort((a, b) => {
      if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) return a.isFeatured ? -1 : 1;
      const sortDelta = Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
      if (sortDelta !== 0) return sortDelta;
      return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
    });
}

export async function upsertLocalJewelryItem(item) {
  const now = new Date().toISOString();
  const items = await readItems();
  const index = items.findIndex((entry) => entry.id === item.id);
  const nextItem = {
    ...item,
    createdAt: index >= 0 ? items[index].createdAt || now : now,
    updatedAt: now,
  };

  if (index >= 0) {
    items[index] = nextItem;
  } else {
    items.push(nextItem);
  }

  await writeItems(items);
  return nextItem;
}

export async function deleteLocalJewelryItem(id) {
  const items = await readItems();
  await writeItems(items.filter((item) => item.id !== id));
}
