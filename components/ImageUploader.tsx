"use client";

import { useState } from "react";

export function ImageUploader({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setValue(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 !min-h-0 py-2.5 px-3"
          placeholder="https://... или /uploads/..."
          required
        />
        <label className="cursor-pointer bg-sky-100 hover:bg-sky-200 text-sky-800 dark:bg-sky-900/40 dark:hover:bg-sky-800/40 dark:text-sky-200 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center">
          {loading ? "Загрузка..." : "Файл..."}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      </div>
      {value && (
        <img
          src={value}
          alt="Preview"
          className="h-32 min-w-[200px] w-auto max-w-full object-cover rounded-xl mt-2 border border-slate-200 dark:border-slate-800"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
          onLoad={(e) => {
            (e.target as HTMLImageElement).style.display = "block";
          }}
        />
      )}
    </div>
  );
}
