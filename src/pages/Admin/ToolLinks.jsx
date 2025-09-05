import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import FolderGroup from './FolderGroup';
import CouponManager from './CouponManager';
import { Menu, X } from "lucide-react"; //

export default function ToolLinkPage() {
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [tools, setTools] = useState([]);
    const [selectedTool, setSelectedTool] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openFolders, setOpenFolders] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const CMS_ENDPOINT = import.meta.env.VITE_STRAPI_HOST;
    const CMS_TOKEN = import.meta.env.VITE_CMS_TOKEN;
    const ADMIN_PWD = import.meta.env.VITE_ADMIN_PWD;

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PWD) {
            setAuthenticated(true);
            Cookies.set('adminauth', 'true', { expires: 3, sameSite: 'Strict', secure: true });
        } else {
            alert('Invalid password. Please try again.');
        }
    };

    useEffect(() => {
        const auth = Cookies.get('adminauth') === 'true';
        if (auth) setAuthenticated(true);
        if (!authenticated) return;

        const fetchTools = async () => {
            try {
                const response = await fetch(
                    `${CMS_ENDPOINT}/api/tool-links?populate=Icon&pagination[pageSize]=100`,
                    {
                        headers: { Authorization: `Bearer ${CMS_TOKEN}` },
                    }
                );
                const result = await response.json();

                const formattedTools = result.data.map((item) => ({
                    id: item.id,
                    platform: item.Platform,
                    url: item.URL,
                    description: item.Description,
                    embedding: item.Embedding,
                    iconUrl: item.Icon?.url || null,
                    folder: item.Folder || 'Ungrouped',
                }));

                formattedTools.push({
                    id: 'coupon-manager',
                    platform: 'Coupon Manager',
                    url: null,
                    description: 'Manage coupons for accounts and influencers',
                    embedding: false,
                    iconUrl: null,
                    folder: 'Admin Tools',
                    isCouponManager: true,
                });

                setTools(formattedTools);

                const folders = Array.from(new Set(formattedTools.map(t => t.folder)));
                setOpenFolders(
                    folders.reduce((acc, name) => ({ ...acc, [name]: false }), {})
                );
            } catch (error) {
                console.error('Error fetching tools:', error);
            }
        };
        fetchTools();
    }, [authenticated]);

    function selectTool(tool) {
        setSelectedTool(tool);
    }

    const filteredTools = tools.filter(tool =>
        tool.platform
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
    );

    const grouped = filteredTools.reduce((acc, tool) => {
        const key = tool.folder;
        if (!acc[key]) acc[key] = [];
        acc[key].push(tool);
        return acc;
    }, {});

    const toggleFolder = name =>
        setOpenFolders(prev => ({ ...prev, [name]: !prev[name] }));

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

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar */}
            {sidebarOpen && (
                <aside className="w-full md:!w-1/4 bg-gray-100 p-4 min-h-48 max-h-[50vh] md:max-h-[80vh] overflow-y-auto transition-all duration-300">
                    <div className="mb-2 flex justify-between items-center">
                        <input
                            type="text"
                            placeholder="Search platforms…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-1 border rounded focus:outline-none focus:ring"
                        />
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="ml-2 text-gray-600 hover:text-red-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {filteredTools.length > 0 ? (
                        Object.entries(grouped).map(([folderName, toolsInFolder]) => (
                            <FolderGroup
                                key={folderName}
                                name={folderName}
                                tools={toolsInFolder}
                                isOpen={openFolders[folderName]}
                                onToggle={() => toggleFolder(folderName)}
                                selectedTool={selectedTool}
                                selectTool={selectTool}
                            />
                        ))
                    ) : (
                        <p className="text-sm italic text-gray-500">No other platforms match '{searchTerm}'.</p>
                    )}
                    <a href='https://api.do360.com/admin/content-manager/collection-types/api::tool-link.tool-link' target='_blank' >
                        <button
                            type='button'
                            className='w-full bg-blue-500 hover:bg-blue-700 rounded text-white py-1.5'
                        >
                            Manage Tools
                        </button>
                    </a>
                </aside>
            )}

            {/* Main content */}
            <main className="flex-1 flex-col items-center justify-center text-center p-6 overflow-y-auto relative">
                {/* Sidebar toggle button (when sidebar hidden) */}
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute top-4 left-4 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-800"
                    >
                        <Menu size={20} />
                    </button>
                )}

                {!selectedTool ? (
                    <p className="text-gray-500">
                        Please select from the left side.
                    </p>
                ) : selectedTool.isCouponManager ? (
                    <CouponManager /> 
                ) : selectedTool.embedding === true ? (
                    <iframe className="w-full h-full min-h-[60vh]"
                        src={selectedTool.url}>
                    </iframe>
                ) : (
                    <div className="max-w-lg mx-auto">
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
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedTool.platform}
                        </h2>
                        <p className="mb-4 min-h-12 md:min-h-48">{selectedTool.description}</p>
                        <button
                            onClick={() =>
                                window.open(selectedTool.url, '_blank', 'noopener')
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Open in a new tab
                        </button>
                        <p className="text-gray-500 text-sm mt-2 break-all">
                            {selectedTool.url}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
