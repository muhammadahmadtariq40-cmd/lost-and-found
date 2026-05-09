import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const initialUsers = [
  { id: '1', name: 'Alice Smith', email: 'alice@uni.edu', role: 'admin', joined: '2023-08-15' },
  { id: '2', name: 'Bob Jones', email: 'bob@uni.edu', role: 'student', joined: '2023-09-01' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@uni.edu', role: 'student', joined: '2024-01-10' },
];

const initialItems = [
  { id: 'i1', title: 'Blue Hydroflask', type: 'lost', category: 'Other', submittedBy: '2', date: '2024-05-10', location: 'Library 2nd Floor', description: 'Sticker of a cat on it.', status: 'Open' },
  { id: 'i2', title: 'iPhone 13 Pro', type: 'lost', category: 'Electronics', submittedBy: '3', date: '2024-05-12', location: 'Science Building', description: 'Black case, cracked screen protector.', status: 'Open' },
  { id: 'i3', title: 'Student ID - Alice', type: 'lost', category: 'ID Cards', submittedBy: '1', date: '2024-05-14', location: 'Cafeteria', description: 'Lost it during lunch.', status: 'Matched' },
  { id: 'i4', title: 'Calculus Textbook', type: 'lost', category: 'Books', submittedBy: '2', date: '2024-05-15', location: 'Math Hall', description: '8th edition, has my name inside.', status: 'Open' },
  { id: 'i5', title: 'Dorm Keys', type: 'lost', category: 'Keys', submittedBy: '3', date: '2024-05-16', location: 'Gym', description: 'On a red lanyard.', status: 'Open' },
  
  { id: 'i6', title: 'Black Umbrella', type: 'found', category: 'Other', submittedBy: '1', date: '2024-05-11', location: 'Main Entrance', storedLocation: 'Security Desk', description: 'Found during the rain.', status: 'Open', image: 'https://images.unsplash.com/photo-1556428318-7b4c6e932462?w=300&q=80' },
  { id: 'i7', title: 'AirPods Case', type: 'found', category: 'Electronics', submittedBy: '2', date: '2024-05-12', location: 'Library 1st Floor', storedLocation: 'Library Lost & Found', description: 'White case, no airpods inside.', status: 'Open', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&q=80' },
  { id: 'i8', title: 'Grey Hoodie', type: 'found', category: 'Clothing', submittedBy: '3', date: '2024-05-13', location: 'Student Union', storedLocation: 'Student Union Desk', description: 'Size M, university logo.', status: 'Open', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&q=80' },
  { id: 'i9', title: 'Car Keys', type: 'found', category: 'Keys', submittedBy: '1', date: '2024-05-14', location: 'Parking Lot C', storedLocation: 'Security Desk', description: 'Toyota keys with a leather keychain.', status: 'Matched', image: 'https://images.unsplash.com/photo-1559132219-5867ce8b62ec?w=300&q=80' },
  { id: 'i10', title: 'Physics Notebook', type: 'found', category: 'Books', submittedBy: '2', date: '2024-05-16', location: 'Science Building Room 101', storedLocation: 'Professor Office', description: 'Blue spiral notebook.', status: 'Open', image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=300&q=80' },
];

const initialClaims = [
  { id: 'c1', itemId: 'i9', claimantId: '2', proof: 'My car is a Toyota Corolla and I parked in Lot C.', status: 'Pending' }
];

const initialNotifications = [
  { id: 'n1', userId: '2', message: 'A match was found for your lost item: Calculus Textbook', read: false, date: '2024-05-16T10:00:00Z' },
  { id: 'n2', userId: '2', message: 'Your claim for "Car Keys" is pending admin review.', read: true, date: '2024-05-15T14:30:00Z' },
];

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [items, setItems] = useState(initialItems);
  const [claims, setClaims] = useState(initialClaims);
  const [notifications, setNotifications] = useState(initialNotifications);

  const addItem = (item) => {
    setItems([{ ...item, id: Date.now().toString(), status: 'Open' }, ...items]);
  };

  const updateItemStatus = (id, status) => {
    setItems(items.map(item => item.id === id ? { ...item, status } : item));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addClaim = (claim) => {
    setClaims([{ ...claim, id: Date.now().toString(), status: 'Pending' }, ...claims]);
  };

  const updateClaimStatus = (id, status) => {
    setClaims(claims.map(claim => claim.id === id ? { ...claim, status } : claim));
  };

  const addNotification = (notification) => {
    setNotifications([{ ...notification, id: Date.now().toString(), read: false, date: new Date().toISOString() }, ...notifications]);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = (userId) => {
    setNotifications(notifications.map(n => n.userId === userId ? { ...n, read: true } : n));
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
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
