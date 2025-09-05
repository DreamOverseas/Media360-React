import React, { useState, useEffect, useRef, useCallback } from 'react';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for adding coupons
  const [newCoupon, setNewCoupon] = useState({
    title: '',
    active: true,
    expiry: '',
    description: '',
    usesLeft: 1
  });
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  // Drag-to-scroll states and ref
  const scrollContainerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const scrollTopRef = useRef(0);

  const API_BASE = 'https://api.do360.com/api';

  useEffect(() => {
    fetchData();
  }, []);

  // Drag-to-scroll event handlers
  const handleMouseDown = useCallback((e) => {
    if (!scrollContainerRef.current) return;
    
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    startYRef.current = e.pageY - scrollContainerRef.current.offsetTop;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    scrollTopRef.current = scrollContainerRef.current.scrollTop;
    
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
    
    // Prevent default to avoid text selection
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = '';
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walkX = (x - startXRef.current) * 2; // Horizontal scroll multiplier
    const walkY = (y - startYRef.current) * 2; // Vertical scroll multiplier
    
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walkX;
    scrollContainerRef.current.scrollTop = scrollTopRef.current - walkY;
  }, []);

  // Add global event listeners for mouse events
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        handleMouseUp();
      }
    };

    const handleGlobalMouseMove = (e) => {
      if (isDraggingRef.current) {
        handleMouseMove(e);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [couponsRes, accountsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/Coupons?populate=users_permissions_user&populate=AssignedFrom`),
        fetch(`${API_BASE}/coupon-sys-accounts`),
        fetch(`${API_BASE}/users`)
      ]);

      if (!couponsRes.ok || !accountsRes.ok || !usersRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [couponsData, accountsData, usersData] = await Promise.all([
        couponsRes.json(),
        accountsRes.json(),
        usersRes.json()
      ]);

      setCoupons(couponsData.data || couponsData);
      setAccounts(accountsData.data || accountsData);
      const influencers = (usersData.data || usersData).filter(user => user.roletype === 'Influencer');
      setUsers(influencers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper: generate random 32-digit hex string
  const generateHash = () => {
    return [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  // Helper function to check if coupon already exists
  const couponExists = (accountId, userId) => {
    return coupons.some(coupon =>
      coupon.AssignedFrom?.documentId === accountId &&
      coupon.users_permissions_user?.documentId === userId
    );
  };

  // Handle coupon submission with All Account / All User support
  const handleAddCoupon = async (e) => {
    e.preventDefault();

    try {
      if (!selectedAccount || !selectedUser) {
        alert('Please select account and user');
        return;
      }

      const targetAccounts = selectedAccount === 'ALL' ? accounts : accounts.filter(acc => acc.documentId === selectedAccount);
      const targetUsers = selectedUser === 'ALL' ? users : users.filter(usr => usr.documentId === selectedUser);

      for (let acc of targetAccounts) {
        for (let usr of targetUsers) {
          // Avoid duplicates
          if (couponExists(acc.documentId, usr.documentId)) continue;

          const payload = {
            Title: (selectedAccount === 'ALL' || selectedUser === 'ALL') ? `${acc.Name} - ${usr.username}` : newCoupon.title,
            Active: newCoupon.active,
            Expiry: newCoupon.expiry,
            Description: newCoupon.description,
            UsesLeft: newCoupon.usesLeft,
            Hash: generateHash(),
            Hide: false,
            Type: 'NetRed',
            Scanned: 0,
            AssignedFrom: acc.documentId,
            users_permissions_user: usr.documentId
          };

          await fetch(`${API_BASE}/Coupons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: payload })
          });
        }
      }

      alert('Coupons added successfully!');
      fetchData();
    } catch (err) {
      alert('Error adding coupon: ' + err.message);
    }
  };

  // Helper function to find coupon for a specific account and user
  const findCoupon = (accountDocumentId, userDcumentId) => {
    return coupons.find(coupon => {
      const account = accounts.find(acc => acc.documentId === accountDocumentId);
      if (!account) return false;
      return coupon.AssignedFrom?.documentId === account.documentId && coupon.users_permissions_user?.documentId === userDcumentId;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl text-gray-600">Loading coupon data...</div></div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl text-red-600">Error: {error}</div></div>;
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Coupon Manager</h1>
        <p className="text-gray-600">Displaying coupons for {accounts.length} accounts and {users.length} influencers</p>
      </div>

      {/* Add coupon form */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Coupon</h2>
        <form onSubmit={handleAddCoupon} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input type="text" value={newCoupon.title} onChange={e => setNewCoupon({ ...newCoupon, title: e.target.value })} className="border rounded w-full p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={newCoupon.description} onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })} className="border rounded w-full p-2" />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium">Active</label>
              <input type="checkbox" checked={newCoupon.active} onChange={e => setNewCoupon({ ...newCoupon, active: e.target.checked })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Expiry</label>
              <input type="date" value={newCoupon.expiry} onChange={e => setNewCoupon({ ...newCoupon, expiry: e.target.value })} className="border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Uses Left</label>
              <input type="number" min="1" value={newCoupon.usesLeft} onChange={e => setNewCoupon({ ...newCoupon, usesLeft: parseInt(e.target.value) })} className="border rounded p-2 w-20" />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium">Select Account</label>
              <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} className="border rounded p-2">
                <option value="">-- Select Account --</option>
                <option value="ALL">All Accounts</option>
                {accounts.map(acc => <option key={acc.documentId} value={acc.documentId}>{acc.Name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Select User</label>
              <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="border rounded p-2">
                <option value="">-- Select User --</option>
                <option value="ALL">All Users</option>
                {users.map(usr => <option key={usr.documentId} value={usr.documentId}>{usr.username}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Coupon</button>
        </form>
      </div>

      {/* Coupons table with 2D drag-to-scroll */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="mb-2 px-4 py-2 bg-gray-50 text-sm text-gray-600 border-b flex items-center gap-2">
          <span className="text-lg">🖱️</span>
          <span>Click and drag to scroll horizontally and vertically through the table</span>
        </div>
        <div 
          ref={scrollContainerRef}
          className="overflow-auto select-none"
          onMouseDown={handleMouseDown}
          style={{ 
            cursor: isDraggingRef.current ? 'grabbing' : 'grab',
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e0 #f7fafc',
            maxHeight: '70vh' // Limit height to enable vertical scrolling
          }}
        >
          <table className="min-w-full" style={{ pointerEvents: 'none' }}>
            <thead className="bg-gray-50 sticky top-0 z-20">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 sticky left-0 bg-gray-50 z-30">Account / User</th>
                {users.map(user => (
                  <th key={user.documentId} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 min-w-48">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">{user.username}</span>
                      <span className="text-xs text-gray-400 normal-case">{user.email}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account, accountIndex) => (
                <tr key={account.documentId} className={accountIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200 sticky left-0 z-10" style={{ backgroundColor: accountIndex % 2 === 0 ? 'white' : '#f9fafb' }}>
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{account.Name}</div>
                      <div className="text-xs text-gray-500">{account.Role}</div>
                      <div className="text-xs text-gray-500">Status: {account.CurrentStatus}</div>
                    </div>
                  </td>
                  {users.map(user => {
                    const coupon = findCoupon(account.documentId, user.documentId);
                    return (
                      <td key={`${account.documentId}-${user.documentId}`} className="px-4 py-4 border-r border-gray-200">
                        {coupon ? (
                          <div className="space-y-1">
                            <div className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">Hash: {coupon.Hash?.substring(0, 8)}...</div>
                            <div className="text-sm font-medium text-gray-900 truncate" title={coupon.Title}>{coupon.Title}</div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Scanned: <span className="font-medium">{coupon.Scanned}</span></span>
                              <span>Left: <span className="font-medium">{coupon.UsesLeft}</span></span>
                            </div>
                            <div className="text-xs text-gray-500">Expires: {formatDate(coupon.Expiry)}</div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${coupon.Active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{coupon.Active ? 'Active' : 'Inactive'}</span>
                              <span className="text-xs text-gray-500">{coupon.Type}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 text-sm py-4">No coupon</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Total Coupons: {coupons.length} | Active Accounts: {accounts.filter(acc => acc.CurrentStatus === 'active').length} | Influencers: {users.length}</p>
      </div>
    </div>
  );
};

export default CouponManager;