import {useRef} from 'react';

/**
 * FolderGroup
 *
 * Renders a collapsible folder with an animated height transition.
 */
export default function FolderGroup({
    name,
    tools,
    isOpen,
    onToggle,
    selectedTool,
    selectTool,
}) {
    // ref to measure the inner content’s full height
    const contentRef = useRef(null);
    
    const CMS_ENDPOINT = import.meta.env.VITE_STRAPI_HOST;

    return (
        <div className="mb-2">
            {/* Folder header */}
            <button
                onClick={onToggle}
                className={`flex justify-between items-center w-full p-2 font-medium rounded shadow-black/20 shadow-2xs hover:bg-gray-200 ${isOpen && "bg-amber-100/50"}`}
            >
                <span>{name}</span>
                <i className={`bi ${isOpen ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
            </button>

            {/* Collapsible list */}
            <div
                ref={contentRef}
                className="overflow-hidden transition-all duration-300 mt-2"
                style={{
                    maxHeight: isOpen
                        ? `${contentRef.current?.scrollHeight}px`
                        : '0px',
                }}
            >
                {tools.map(tool => (
                    <div
                        key={tool.id}
                        onClick={() => selectTool(tool)}
                        className={`
                flex items-center p-2 pl-6 mb-2 rounded cursor-pointer
                hover:bg-gray-300
                ${selectedTool?.id === tool.id ? '!bg-blue-300/50' : ''}
            `}
                    >
                        {tool.iconUrl ? (
                            <img
                                src={`${CMS_ENDPOINT}${tool.iconUrl}`}
                                alt={`${tool.platform} icon`}
                                className="w-6 h-6 mr-2"
                            />
                        ) : (
                            <i className="bi bi-tools text-lg mr-2"></i>
                        )}
                        <span>{tool.platform}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}