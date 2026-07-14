"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center bg-slate-950 text-sm text-slate-400">
      Loading SQL editor...
    </div>
  ),
});

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SqlEditor({ value, onChange }: SqlEditorProps) {
  return (
    <MonacoEditor
      height="300px"
      language="sql"
      theme="vs-dark"
      value={value}
      onChange={(nextValue) => onChange(nextValue ?? "")}
      options={{
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: false },
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        tabSize: 2,
        wordWrap: "on",
      }}
    />
  );
}
