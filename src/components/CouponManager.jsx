import React, { useState, useEffect } from 'react';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'https://api.do360.com/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [couponsRes, accountsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/Coupons`),
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
      
      // Filter users to only include Influencers
      const influencers = (usersData.data || usersData).filter(user => user.roletype === 'Influencer');
      setUsers(influencers);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to find coupon for a specific account and user
  const findCoupon = (accountDocumentId, username) => {
    return coupons.find(coupon => {
      // Find the account by documentId to get the name
      const account = accounts.find(acc => acc.documentId === accountDocumentId);
      if (!account) return false;
      
      // Check if coupon title contains account name and is assigned to the user
      return coupon.Title?.includes(account.Name) && coupon.AssignedTo === username;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading coupon data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Coupon Manager</h1>
        <p className="text-gray-600">
          Displaying coupons for {accounts.length} accounts and {users.length} influencers
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Account / User
                </th>
                {users.map(user => (
                  <th key={user.documentId} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-48">
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
                  <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{account.Name}</div>
                      <div className="text-xs text-gray-500">{account.Role}</div>
                      <div className="text-xs text-gray-500">Status: {account.CurrentStatus}</div>
                    </div>
                  </td>
                  {users.map(user => {
                    const coupon = findCoupon(account.documentId, user.username);
                    return (
                      <td key={`${account.documentId}-${user.documentId}`} className="px-4 py-4 border-r border-gray-200">
                        {coupon ? (
                          <div className="space-y-1">
                            <div className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              Hash: {coupon.Hash?.substring(0, 8)}...
                            </div>
                            <div className="text-sm font-medium text-gray-900 truncate" title={coupon.Title}>
                              {coupon.Title}
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Scanned: <span className="font-medium">{coupon.Scanned}</span></span>
                              <span>Left: <span className="font-medium">{coupon.UsesLeft}</span></span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Expires: {formatDate(coupon.Expiry)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                coupon.Active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {coupon.Active ? 'Active' : 'Inactive'}
                              </span>
                              <span className="text-xs text-gray-500">{coupon.Type}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 text-sm py-4">
                            No coupon
                          </div>
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