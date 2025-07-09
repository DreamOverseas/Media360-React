import React, { useState, useEffect } from 'react';

export default function ToolLinkPage() {
    // State for admin password input
    const [password, setPassword] = useState('');
    // Authentication flag
    const [authenticated, setAuthenticated] = useState(false);
    // Fetched tools from Strapi
    const [tools, setTools] = useState([]);
    // Currently selected tool
    const [selectedTool, setSelectedTool] = useState(null);

    // Environment variables
    const CMS_ENDPOINT = import.meta.env.VITE_STRAPI_HOST;
    const CMS_TOKEN = import.meta.env.VITE_CMS_TOKEN;
    const ADMIN_PWD = import.meta.env.VITE_ADMIN_PWD;

    /**
     * Handle admin login form submission.
     */
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PWD) {
            setAuthenticated(true);
        } else {
            alert('Invalid password. Please try again.');
        }
    };

    /**
     * Fetch tool data from Strapi once the user is authenticated.
     */
    useEffect(() => {
        if (!authenticated) return;

        const fetchTools = async () => {
            try {
                const response = await fetch(
                    `${CMS_ENDPOINT}/api/tool-links?populate=Icon`,
                    {
                        headers: { Authorization: `Bearer ${CMS_TOKEN}` },
                    }
                );
                const result = await response.json();

                // Map Strapi response to local format
                const formattedTools = result.data.map((item) => ({
                    id: item.id,
                    platform: item.Platform,
                    url: item.URL,
                    description: item.Description,
                    iconUrl:
                        item.Icon?.url || null,
                }));

                setTools(formattedTools);
            } catch (error) {
                console.error('Error fetching tools:', error);
            }
        };

        fetchTools();
    }, [authenticated]);

    // Render login form if not authenticated
    if (!authenticated) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <form
                    onSubmit={handleLogin}
                    className="bg-white p-8 rounded shadow-lg shadow-blue-500/50 w-96"
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Admin Login
                    </h2>
                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded mb-4"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-800 text-white p-2 rounded"
                    >
                        Let's Go
                    </button>
                </form>
            </div>
        );
    }

    // Render the main tool management UI
    return (
        <div className="flex h-full">
            {/* Sidebar navigation */}
            <aside className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
                {tools.map((tool) => (
                    <div
                        key={tool.id}
                        onClick={() => setSelectedTool(tool)}
                        className={`flex items-center p-2 mb-2 rounded cursor-pointer hover:bg-gray-300 ${selectedTool?.id === tool.id ? 'bg-blue-300/50' : ''
                            }`}
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
                <a href='https://api.do360.com/admin/content-manager/collection-types/api::tool-link.tool-link' target='_blank' >
                    <button
                        type='button'
                        className='w-full bg-blue-500 hover:bg-blue-700 rounded text-white py-1.5'
                    >
                        Manage Tools
                    </button>
                </a>
            </aside>

            {/* Main content area */}
            <main className="flex-1 flex-col items-center justify-center text-center p-6 overflow-y-auto">
                {!selectedTool ? (
                    <p className="text-gray-500">
                        Please select a tool from the left side.
                    </p>
                ) : (
                    <div className="max-w-lg mx-auto">
                        {/* Tool Icon */}
                        {selectedTool.iconUrl ? (
                            <img
                                src={`${CMS_ENDPOINT}${selectedTool.iconUrl}`}
                                alt={`${selectedTool.platform} icon`}
                                className="w-24 h-24 mb-4 mx-auto self-center"
                            />
                        ) : (
                            <div className='my-auto h-24'>
                            <i className="bi bi-tools text-7xl"></i>
                            </div>
                        )}

                        {/* Tool Platform Title */}
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedTool.platform}
                        </h2>

                        {/* Tool Description */}
                        <p className="mb-4 min-h-48">{selectedTool.description}</p>

                        {/* Open URL Button */}
                        <button
                            onClick={() =>
                                window.open(selectedTool.url, '_blank', 'noopener')
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Open in a new tab
                        </button>

                        {/* URL display */}
                        <p className="text-gray-500 text-sm mt-2 break-all">
                            {selectedTool.url}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
