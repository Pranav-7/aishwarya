import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Badge, 
  IconButton,
  Box 
} from '@mui/material';
import { ShoppingCart, Person, AdminPanelSettings } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ cartItemCount = 0 }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Admin email addresses - add more admin emails here
  const adminEmails = ['admin@aishwarya.com', 'rishikeshbaikerikar93@gmail.com'];
  
  // Check if current user is admin
  const isAdmin = currentUser && adminEmails.includes(currentUser.email);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
                    <AppBar position="static" sx={{ backgroundColor: '#10B981' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, fontWeight: 'bold', color: '#1a1a1a' }}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          Aishwarya Luxury Jewelery
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/cart')}
            sx={{ color: '#1a1a1a' }}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          
          {currentUser ? (
            <>
              {isAdmin && (
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/admin')}
                  sx={{ color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 1 }}
                  startIcon={<AdminPanelSettings />}
                >
                  Admin Panel
                </Button>
              )}
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{ color: '#1a1a1a' }}
              >
                Logout
              </Button>
              <IconButton sx={{ color: '#1a1a1a' }}>
                <Person />
              </IconButton>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{ color: '#1a1a1a' }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/signup')}
                sx={{ color: '#1a1a1a' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 