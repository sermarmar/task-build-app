import { useRef, useState, type ReactElement } from "react";
import { TEXT_COLORS } from "../../shared/constants";

interface TextareaDynamicProps {
    label?: string;
    onChange?: (value: string) => void;
}

export const TextareaDynamic: React.FC<TextareaDynamicProps> = ({ label, onChange }) => {

    const editorRef  = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    let labelElement: ReactElement = <></>;

    if(label) {
        labelElement = <label className="block text-sm font-medium text-gray-700 mb-2">
            { label }
        </label>
    }

    return (
        <div className="flex flex-col">
            {labelElement}
            <div
              ref={wrapperRef}
              className="border border-gray-300 rounded-xl overflow-hidden transition-colors">
                <RichToolbar editorRef={editorRef} />
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="rich-editor px-4 py-3 text-sm text-black leading-relaxed h-80"
                    data-placeholder="Añade una descripción con formato..."/>
            </div>
        </div>
    );

}

const RichToolbar: React.FC<{ editorRef: React.RefObject<HTMLDivElement> }> = ({ editorRef }) => {
    const [activeColor, setActiveColor] = useState(TEXT_COLORS[0].hex);
    const [activeFmt, setActiveFmt] = useState({ bold: false, italic: false, underline: false });

    const refresh = () => setActiveFmt({
        bold:      document.queryCommandState("bold"),
        italic:    document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"), 
    });

    const exec = (cmd, val: string | null = null) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, val);
        setTimeout(refresh, 0);
    };

    const applyColor = (hex: string) => {
        setActiveColor(hex);
        exec("foreColor", hex);
    };

    const fmtBtn = (cmd, char: string, extra = {}) => {
        const active = activeFmt[cmd];
        return (
        <button
            onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
            title={char}
            className={`px-2.5 py-1 rounded border text-xs transition-all duration-150 ${
            active
                ? "bg-[#e85d3520] text-[#e85d35] border-[#e85d3555]"
                : "bg-transparent text-[#666] border-[#252525] hover:bg-[#1e1e1e] hover:text-[#e8e0d5] hover:border-[#3a3a3a]"
            }`}
            style={extra}
        >{char}</button>
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-gray-300 rounded-t-lg">
        {fmtBtn("bold",      "B", { fontWeight: 700 })}
        {fmtBtn("italic",    "I", { fontStyle: "italic" })}
        {fmtBtn("underline", "U", { textDecoration: "underline" })}

        <div className="w-px h-4 mx-1" />

        {TEXT_COLORS.map(({ hex, label }) => (
            <button
            key={hex}
            onMouseDown={(e) => { e.preventDefault(); applyColor(hex); }}
            title={label}
            className={`w-5 h-5 rounded-full transition-all duration-150 hover:scale-125 ${activeColor === hex ? "ring-2 ring-white ring-offset-1 ring-offset-[#0f0f0f]" : ""}`}
            style={{ background: hex }}
            />
        ))}

        <div className="w-px h-4 mx-1" />

        <button
            onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); setTimeout(refresh, 0); }}
            className="px-2 py-1 rounded border border-[#252525] bg-transparent text-[#555] text-[11px] hover:bg-[#1e1e1e] hover:text-[#e8e0d5] hover:border-[#3a3a3a] transition-all"
            title="Limpiar formato"
        >✕ fmt</button>
        </div>
    );
}