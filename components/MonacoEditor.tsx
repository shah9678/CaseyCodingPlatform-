import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

interface MonacoEditorProps {
  code: string;
  onChange: (value: string) => void;
  theme: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  code,
  onChange,
  theme,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  useEffect(() => {
    if (editorRef.current) {
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: code,
        language: "typescript",
        theme: theme, // Use the theme passed from the parent component
        minimap: { enabled: false },
        automaticLayout: true,
      });

      monacoEditorRef.current.onDidChangeModelContent(() => {
        onChange(monacoEditorRef.current?.getValue() || "");
      });
    }

    return () => {
      monacoEditorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (monacoEditorRef.current) {
      if (monacoEditorRef.current.getValue() !== code) {
        monacoEditorRef.current.setValue(code);
      }
    }
  }, [code]);

  useEffect(() => {
    monaco.editor.setTheme(theme);
  }, [theme]);

  return <div ref={editorRef} style={{ width: "100%", height: "400px" }} />;
};

export default MonacoEditor;
