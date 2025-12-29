const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// In-memory data
const users = [
    { username: 'admin', password: 'admin', role: 'ADMIN', name: 'Admin User' },
    { username: 'manager', password: 'manager', role: 'MANAGER', name: 'Manager User' },
    { username: 'user', password: 'user', role: 'USER', name: 'Regular User' }
];

let trips = [
    {
        id: 1,
        destination: 'Bangalore Office',
        description: 'Tech Conference',
        startDate: '2025-08-15',
        endDate: '2025-08-17',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 2,
        destination: 'Paris Office',
        description: 'Business trip to HQ',
        startDate: '2025-12-10',
        endDate: '2025-12-17',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop'
    }
];


let notifications = [
    { id: 1, userId: 'user', message: 'Welcome to the Corporate Platform!', read: false, date: new Date().toISOString() }
];

let updateRequests = [];

// Routes
// Auth Route
app.post('/corporate/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        const token = `mock-jwt-token-${Date.now()}`;
        res.json({ token, user: userWithoutPassword });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.get('/corporate/users', (req, res) => {
    res.json(users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    }));
});

app.post('/corporate/users', (req, res) => {
    const newUser = req.body;
    if (users.some(u => u.username === newUser.username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    // Simple ID generation
    newUser.id = users.length + 1;
    users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
});

app.delete('/corporate/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = users.length;
    // Note: This won't work perfectly for const array but we're reassigning in memory if we change to let,
    // or we can use splice. Since 'users' is const, let's use splice.
    const index = users.findIndex(u => (u.id || 0) === id);
    // mock data doesn't have IDs initially for admin/manager/user, let's treat username as ID or add IDs.
    // simpler: filter by username if passed, or just assume we only delete created users with IDs.

    if (index !== -1) {
        users.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Trip Routes
app.get('/corporate/trips', (req, res) => {
    res.json(trips);
});

app.post('/corporate/trips', (req, res) => {
    const trip = req.body;

    const maxId = trips.reduce((max, t) => Math.max(max, t.id || 0), 0);
    trip.id = maxId + 1;
    trips.push(trip);
    res.status(201).json(trip);
});

app.delete('/corporate/trips/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = trips.findIndex(t => t.id === id);
    if (index !== -1) {
        trips.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Trip not found' });
    }
});

app.get('/corporate/trips/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const trip = trips.find(t => t.id === id);
    if (trip) {
        res.json(trip);
    } else {
        res.status(404).json({ message: 'Trip not found' });
    }
});

app.put('/corporate/trips/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const index = trips.findIndex(t => t.id === id);
    if (index !== -1) {
        trips[index] = { ...trips[index], ...updates };
        res.json(trips[index]);
    } else {
        res.status(404).json({ message: 'Trip not found' });
    }
});

// Booking Routes
let bookings = [];
app.get('/corporate/bookings', (req, res) => {
    res.json(bookings);
});

app.post('/corporate/bookings', (req, res) => {
    const booking = req.body;
    booking.id = bookings.length + 1;
    // Mock flight details
    booking.flightDetails = {
        airline: 'Corporate Air',
        flightNumber: 'CA-' + Math.floor(Math.random() * 1000),
        departureTime: '10:00 AM',
        arrivalTime: '02:00 PM'
    };
    bookings.push(booking);
    res.status(201).json(booking);
});

app.get('/corporate/notifications', (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const userNotifs = notifications.filter(n => n.userId === userId);
        res.json(userNotifs);
    } else {
        res.json(notifications);
    }
});

app.delete('/corporate/notifications/:id', (req, res) => {
    const id = parseInt(req.params.id);
    notifications = notifications.filter(n => n.id !== id);
    res.status(204).send();
});

// Profile Update Request Flow
app.post('/corporate/profile/update-request', (req, res) => {
    const { userId, updates } = req.body;

    // Create a request
    const request = {
        id: Date.now(),
        userId,
        updates,
        status: 'PENDING',
        date: new Date().toISOString()
    };
    updateRequests.push(request);

    // Notify all managers (for simplicity, we assume 'manager' username exists)
    // In a real app, this would query all users with role MANAGER
    notifications.push({
        id: Date.now() + 1,
        userId: 'manager',
        message: `User ${userId} requested profile update: ${JSON.stringify(updates)}`,
        read: false,
        date: new Date().toISOString(),
        requestId: request.id,
        type: 'APPROVAL_REQUEST'
    });

    // Also notify admin
    notifications.push({
        id: Date.now() + 2,
        userId: 'admin',
        message: `User ${userId} requested profile update: ${JSON.stringify(updates)}`,
        read: false,
        date: new Date().toISOString(),
        requestId: request.id,
        type: 'APPROVAL_REQUEST'
    });

    res.status(201).json({ message: 'Update request submitted for approval.' });
});

// Expense Routes
let expenses = [
    { id: 1, title: 'Flight to Bangalore', amount: 1200, category: 'TRAVEL', date: '2025-08-15', status: 'APPROVED' },
    { id: 2, title: 'Team Dinner', amount: 300, category: 'FOOD', date: '2025-08-16', status: 'PENDING' }
];

app.get('/corporate/expenses', (req, res) => {
    res.json(expenses);
});

app.get('/corporate/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const expense = expenses.find(e => e.id === id);
    if (expense) {
        res.json(expense);
    } else {
        res.status(404).json({ message: 'Expense not found' });
    }
});

app.post('/corporate/expenses', (req, res) => {
    const expense = req.body;
    expense.id = Date.now();
    expense.status = 'PENDING';
    expenses.push(expense);
    res.status(201).json(expense);
});

app.delete('/corporate/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    expenses = expenses.filter(e => e.id !== id);
    res.status(204).send();
});

app.put('/corporate/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
        expenses[index] = { ...expenses[index], ...updates };
        res.json(expenses[index]);
    } else {
        res.status(404).json({ message: 'Expense not found' });
    }
});

app.post('/corporate/manager/approve-request/:id', (req, res) => {
    const requestId = parseInt(req.params.id);
    const requestIndex = updateRequests.findIndex(r => r.id === requestId);

    if (requestIndex !== -1) {
        const request = updateRequests[requestIndex];
        request.status = 'APPROVED';

        // Update the actual user
        const userIndex = users.findIndex(u => u.username === request.userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...request.updates };
        }

        // Notify the user
        notifications.push({
            id: Date.now(),
            userId: request.userId,
            message: `Your profile update request has been APPROVED by manager.`,
            read: false,
            date: new Date().toISOString()
        });

        res.json({ message: 'Request approved and user notified.' });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});


app.listen(port, () => {
    console.log(`Mock server running at http://localhost:${port}`);
});

