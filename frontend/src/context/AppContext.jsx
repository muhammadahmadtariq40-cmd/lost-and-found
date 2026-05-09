import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { token, currentUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchItems = async () => {
    if (!token) return;
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const lostRes = await fetch('/api/lost-items', { headers });
      const lostData = await lostRes.json();
      
      const foundRes = await fetch('/api/found-items', { headers });
      const foundData = await foundRes.json();
      
      // Combine and format for the frontend
      const mapStatus = (status) => {
        if (!status) return 'Open';
        if (status === 'AVAILABLE' || status === 'OPEN') return 'Open';
        if (status === 'MATCHED' || status === 'CLAIMED') return 'Matched';
        if (status === 'RESOLVED') return 'Resolved';
        if (status === 'CLOSED') return 'Closed';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      };

      const formattedLost = (Array.isArray(lostData) ? lostData : []).map(i => ({
        ...i,
        type: 'lost',
        submittedBy: i.user_id,
        date: i.date_lost,
        location: i.location_lost,
        image: i.image_url,
        status: mapStatus(i.status)
      }));
      const formattedFound = (Array.isArray(foundData) ? foundData : []).map(i => ({
        ...i,
        type: 'found',
        submittedBy: i.user_id,
        date: i.date_found,
        location: i.location_found,
        storedLocation: i.custody_location,
        image: i.image_url,
        status: mapStatus(i.status)
      }));
      
      setItems([...formattedLost, ...formattedFound]);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const fetchClaims = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/claims', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      
      const formattedClaims = (Array.isArray(data) ? data : []).map(c => ({
        ...c,
        itemId: c.found_item_id,
        claimantId: c.user_id,
        proof: c.proof_description,
        status: c.status === 'PENDING' ? 'Pending' : c.status === 'APPROVED' ? 'Approved' : 'Rejected'
      }));
      setClaims(formattedClaims);
    } catch (err) {
      console.error('Error fetching claims:', err);
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchItems();
      fetchClaims();
      fetchUsers();
    } else {
      setItems([]);
      setClaims([]);
      setUsers([]);
    }
  }, [token]);

  const addItem = async (item) => {
    try {
      const endpoint = item.type === 'lost' ? '/api/lost-items' : '/api/found-items';
      
      let payload = {
        title: item.title,
        category: item.category,
        description: item.description,
        image_url: item.image
      };

      if (item.type === 'lost') {
        payload.date_lost = item.date;
        payload.location_lost = item.location;
      } else {
        payload.date_found = item.date;
        payload.location_found = item.location;
        payload.custody_location = item.storedLocation;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchItems(); // refresh
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to add item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateItemStatus = async (id, status) => {
    // Requires an endpoint in the backend (PATCH /api/.../:id/status). 
    // For now we do a local optimistic update just in case.
    setItems(items.map(item => item.id === id ? { ...item, status } : item));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addClaim = async (claim) => {
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          found_item_id: claim.itemId,
          lost_item_id: claim.lostItemId, // assuming frontend passes this
          proof_description: claim.proof
        })
      });
      if (res.ok) {
        fetchClaims(); // refresh
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to add claim');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateClaimStatus = async (id, status) => {
    try {
      const dbStatus = status.toUpperCase();
      const res = await fetch(`/api/claims/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: dbStatus })
      });
      if (res.ok) {
        fetchClaims();
        fetchItems();
      } else {
        alert('Failed to update claim');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addNotification = (notification) => {
    // Handled by backend now mostly, but keep for local state if needed
  };

  const markNotificationRead = (id) => {
    // Placeholder
  };

  const markAllRead = (userId) => {
    // Placeholder
  };

  const deleteUser = (id) => {
    // Placeholder
  };

  return (
    <AppContext.Provider value={{
      users, items, claims, notifications,
      addItem, updateItemStatus, deleteItem,
      addClaim, updateClaimStatus,
      addNotification, markNotificationRead, markAllRead,
      deleteUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
