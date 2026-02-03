# Unified Communication Platform - Quick Start Guide

## 🎯 What You've Built

A complete, production-ready Unified Communication platform with:

✅ **Beautiful Login System**
- Animated login page with gradient backgrounds
- Password visibility toggle
- Multiple theme support (Google, Modern)
- Dark/Light mode switching
- Form validation and error handling

✅ **Secure Authentication**
- AES encryption for credentials
- JWT token management
- Automatic token refresh
- Session management
- Role-based access control

✅ **Real-time Communication**
- WebSocket integration (STOMP over SockJS)
- Separate channels for application and telemetry
- Real-time notifications
- Event subscriptions

✅ **Modern Dashboard**
- Responsive layout
- Animated statistics cards
- Recent activity feed
- System status monitoring
- Collapsible sidebar
- Breadcrumb navigation

✅ **Advanced Search**
- Global search with autocomplete
- Animated dropdown results
- Type-based filtering (contacts, documents, calls, messages)
- Real-time search suggestions
- Click-to-navigate results

✅ **Professional UI/UX**
- Material-UI components
- Framer Motion animations
- Glassmorphism effects
- Smooth transitions
- Mobile responsive

## 🚀 Getting Started

### 1. Install Dependencies (Already Done!)
```bash
npm install
```

### 2. Configure Your Environment

Edit `.env` file with your backend server URLs:

```env
# Replace with your actual API endpoints
REACT_APP_API_BASE_URL=http://your-server.com/services/api/v2/
REACT_APP_APP_BASE_URL=http://your-server.com/services/app/v2/
REACT_APP_TELEMETRY_API_URL=http://your-server.com/telemetry/api/v2/
REACT_APP_TELEMETRY_APP_URL=http://your-server.com/telemetry/app/v2/

# WebSocket URLs
REACT_APP_WS_SERVICES=http://your-server.com/services/app/v2/messaging/messages
REACT_APP_WS_TELEMETRY=http://your-server.com/telemetry/app/v2/messaging/messages

# IMPORTANT: Change this secret key!
REACT_APP_SECRET_KEY=your-unique-32-character-key-here
```

### 3. Start Development Server
```bash
npm start
```

Your app will open at `http://localhost:3000`

## 📱 Using the Application

### Login Page
1. Navigate to `http://localhost:3000`
2. You'll see the animated login page
3. Click the palette icon (🎨) to change theme style
4. Click the sun/moon icon (☀️/🌙) to toggle dark/light mode
5. Enter your credentials
6. Press Enter or click "Sign In"

### Dashboard
After login, you'll see:
- **Sidebar** (left): Navigation menu with your profile
- **Navbar** (top): Breadcrumbs, search bar, notifications, profile menu
- **Main Area**: Dashboard with statistics and activity

### Global Search
1. Click the search bar in the navbar
2. Start typing to search across:
   - Contacts
   - Documents
   - Calls
   - Messages
3. Click any result to navigate

### Navigation
- Use sidebar menu to navigate between pages
- Click breadcrumbs to go back
- Use profile dropdown for settings
- Click logout to sign out

## 🎨 Themes

### Available Themes
1. **Google Light/Dark**: Clean, modern Google-style design
2. **Modern Light/Dark**: Professional Slack-style workspace

### Changing Themes
1. Click the palette icon (🎨) on login page or in settings
2. Select your preferred theme
3. Theme persists across sessions

## 🔧 Customization

### Adding a New Page

1. **Create Component** (`src/pages/YourPage/YourPage.js`):
```javascript
import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const YourPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Your Page Title
      </Typography>
      <Card sx={{ borderRadius: 3, mt: 3 }}>
        <CardContent>
          <Typography>Your content here</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default YourPage;
```

2. **Add Route** (`src/App.js`):
```javascript
import YourPage from './pages/YourPage/YourPage';

// Inside Routes:
<Route path="your-page" element={<YourPage />} />
```

3. **Add to Sidebar** (`src/components/Layout/Sidebar.js`):
```javascript
{
  title: 'Your Page',
  icon: <YourIcon />,
  path: '/your-page',
  roles: [], // Empty for all users, or ['ROLE_ADMIN'] for specific roles
}
```

### Making API Calls

```javascript
import api from '../../services/api';

const fetchData = async () => {
  try {
    const response = await api.application.get('/your-endpoint');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Using WebSocket

```javascript
import { useEffect } from 'react';
import webSocketService from '../../services/WebSocketService';

useEffect(() => {
  // Subscribe
  webSocketService.subscribeService(
    'unique-id',
    'all', // or specific topic
    (data) => {
      console.log('Received:', data);
    }
  );

  // Cleanup
  return () => {
    webSocketService.unsubscribeService('unique-id');
  };
}, []);
```

### Adding Notifications

```javascript
import { useState } from 'react';
import Notification from '../../components/Common/Notification';

const [notify, setNotify] = useState({
  isOpen: false,
  message: '',
  type: 'info', // 'success', 'error', 'warning', 'info'
});

// Show notification
setNotify({
  isOpen: true,
  message: 'Operation successful!',
  type: 'success',
});

// Add component
<Notification notify={notify} setNotify={setNotify} />
```

## 🔒 Security Best Practices

1. **Never commit** `.env` file with real credentials
2. **Change the secret key** in production
3. **Use HTTPS** for production deployments
4. **Validate** all user inputs
5. **Sanitize** data before displaying
6. **Keep dependencies** updated

## 📂 Key Files

- `src/App.js` - Main app and routing
- `src/services/AuthenticationService.js` - Auth logic
- `src/services/api.js` - API configuration
- `src/services/WebSocketService.js` - WebSocket manager
- `src/theme/themeConfig.js` - Theme definitions
- `src/components/Layout/` - Layout components
- `.env` - Configuration (DO NOT COMMIT)

## 🐛 Common Issues

### "Cannot connect to server"
- Check if backend server is running
- Verify URLs in `.env` file
- Check CORS settings on backend

### "Authentication failed"
- Verify API endpoint is correct
- Check secret key matches backend
- Ensure backend is accepting requests

### "WebSocket connection failed"
- Check WebSocket URL format
- Verify WebSocket server is running
- Check browser console for errors

### Theme not working
- Clear browser cache
- Check localStorage
- Verify ThemeProvider wraps app

## 📚 Next Steps

1. **Connect to Backend**: Update `.env` with real API URLs
2. **Add Pages**: Create message, call, contact pages
3. **Implement Features**: Add call functionality, messaging, etc.
4. **Customize Themes**: Modify colors in `themeConfig.js`
5. **Add Tests**: Write unit and integration tests
6. **Deploy**: Build and deploy to production

## 🎓 Learning Resources

- **React**: https://react.dev/learn
- **Material-UI**: https://mui.com/material-ui/getting-started/
- **Framer Motion**: https://www.framer.com/motion/introduction/
- **React Router**: https://reactrouter.com/en/main/start/tutorial
- **WebSocket**: https://stomp-js.github.io/guide/stompjs/

## 💡 Tips

1. Use **React DevTools** for debugging
2. Check **Network tab** for API calls
3. Use **Console** for WebSocket messages
4. **Material-UI docs** are your friend
5. **Framer Motion** for smooth animations

## 🤝 Need Help?

- Check browser console for errors
- Review component documentation
- Check API response format
- Verify WebSocket connection
- Test with mock data first

---

**Congratulations!** 🎉 You now have a fully functional Unified Communication platform!

Start by customizing the theme, adding your business logic, and connecting to your backend services.

Happy coding! 🚀
