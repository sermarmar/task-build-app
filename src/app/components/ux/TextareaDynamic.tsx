import { useEffect, useRef, useState, type ReactElement } from "react";
import { TEXT_COLORS } from "../../shared/constants";

interface TextareaDynamicProps {
    label?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}

export const TextareaDynamic: React.FC<TextareaDynamicProps> = ({ label, defaultValue, onChange }) => {

    const editorRef  = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && defaultValue) {
            editorRef.current.innerText = defaultValue;
        }
    }, [defaultValue]);

    let labelElement: ReactElement = <></>;

    if(label) {
        labelElement = <label className="block text-sm font-bold text-primary-800 mb-2">
            { label }
        </label>
    }

    return (
        <div className="flex flex-col">
            {labelElement}
            <div
              ref={wrapperRef}
              className="rounded-3xl bg-white/70 border border-white shadow-clay-inset overflow-hidden transition-colors focus-within:ring-2 focus-within:ring-tertiary-300">
                <RichToolbar editorRef={editorRef} onChange={onChange} />
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => onChange?.((e.currentTarget as HTMLDivElement).innerText)}
                    className="rich-editor px-5 py-4 text-sm text-primary-950 leading-relaxed h-80 outline-none overflow-y-auto scrollbar-primary"
                    data-placeholder="Añade una descripción con formato..."/>
            </div>
        </div>
    );

}

const RichToolbar: React.FC<{ editorRef: React.RefObject<HTMLDivElement | null>; onChange?: (value: string) => void }> = ({ editorRef }) => {
    const [activeColor, setActiveColor] = useState(TEXT_COLORS[0].hex);
    const [activeFmt, setActiveFmt] = useState({ bold: false, italic: false, underline: false });

    const refresh = () => setActiveFmt({
        bold:      document.queryCommandState("bold"),
        italic:    document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"), 
    });

    const exec = (cmd: string, val: string | undefined = undefined) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, val);
        setTimeout(refresh, 0);
    };

    const applyColor = (hex: string) => {
        setActiveColor(hex);
        exec("foreColor", hex);
    };

    const fmtBtn = (cmd: string, char: string, extra = {}) => {
        const active = activeFmt[cmd as keyof typeof activeFmt];
        return (
        <button
            onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
            title={char}
            className={`size-8 rounded-full text-xs transition-all duration-150 cursor-pointer ${
            active
                ? "clay-peach text-white shadow-clay-pressed"
                : "bg-surface text-primary-600 shadow-clay-sm hover:text-primary-900"
            }`}
            style={extra}
        >{char}</button>
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-primary-100">
        {fmtBtn("bold",      "B", { fontWeight: 700 })}
        {fmtBtn("italic",    "I", { fontStyle: "italic" })}
        {fmtBtn("underline", "U", { textDecoration: "underline" })}

        <div className="w-px h-5 mx-1 bg-primary-100" />

        {TEXT_COLORS.map(({ hex, label }) => (
            <button
            key={hex}
            onMouseDown={(e) => { e.preventDefault(); applyColor(hex); }}
            title={label}
            className={`size-5 rounded-full transition-all duration-150 hover:scale-125 cursor-pointer ${activeColor === hex ? "ring-2 ring-white ring-offset-2 ring-offset-primary-300" : ""}`}
            style={{ background: hex }}
            />
        ))}

        <div className="w-px h-5 mx-1 bg-primary-100" />

        <button
            onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); setTimeout(refresh, 0); }}
            className="px-3 py-1.5 rounded-full bg-surface shadow-clay-sm text-primary-500 text-[11px] font-bold hover:text-primary-900 transition-all cursor-pointer"
            title="Limpiar formato"
        >Borrar formato</button>
        </div>
    );
}