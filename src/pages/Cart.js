import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, submitOrder, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleSubmitOrder = async () => {
    if (!currentUser) {
      setSnackbar({
        open: true,
        message: 'Please login to submit an order',
        severity: 'error'
      });
      return;
    }

    if (cartItems.length === 0) {
      setSnackbar({
        open: true,
        message: 'Your cart is empty',
        severity: 'warning'
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter your delivery address',
        severity: 'warning'
      });
      return;
    }

    if (!contactNumber.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter your contact number',
        severity: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderId = await submitOrder(deliveryAddress, contactNumber);
      setSnackbar({
        open: true,
        message: `Order submitted successfully! Order ID: ${orderId}. Please contact +919449100021 for payment confirmation.`,
        severity: 'success'
      });
      navigate('/');
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error submitting order: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Add some beautiful jewelry to your cart to get started!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#D4AF37',
              '&:hover': { backgroundColor: '#B8860B' }
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <img
                      src={item.image || 'https://via.placeholder.com/150x150?text=Jewelry'}
                      alt={item.name}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip 
                        label={`${item.weight || '22K'} Gold`} 
                        size="small" 
                        sx={{ backgroundColor: '#D4AF37', color: 'white' }}
                      />
                      <Chip 
                        label={item.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ₹{item.price?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          size="small"
                          sx={{ width: 60 }}
                          inputProps={{ min: 1, style: { textAlign: 'center' } }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Total: ₹{(item.price * item.quantity).toLocaleString()}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography>Items ({cartItems.length}):</Typography>
                  <Typography>₹{getCartTotal().toLocaleString()}</Typography>
                </Grid>
                <Divider sx={{ my: 1 }} />
                <Grid container justifyContent="space-between">
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ₹{getCartTotal().toLocaleString()}
                  </Typography>
                </Grid>
              </Box>

              {currentUser && (
                <>
                                     <TextField
                     fullWidth
                     label="Delivery Address"
                     multiline
                     rows={3}
                     value={deliveryAddress}
                     onChange={(e) => setDeliveryAddress(e.target.value)}
                     placeholder="Enter your complete delivery address..."
                     sx={{ mb: 2 }}
                     required
                   />
                   
                   <TextField
                     fullWidth
                     label="Contact Number"
                     value={contactNumber}
                     onChange={(e) => setContactNumber(e.target.value)}
                     placeholder="Enter your contact number..."
                     sx={{ mb: 2 }}
                     required
                   />
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Payment Instructions:
                    </Typography>
                    <Typography variant="body2">
                      After order submission, please contact us at:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      📞 +919449100021
                    </Typography>
                    <Typography variant="body2">
                      for payment confirmation and delivery details.
                    </Typography>
                  </Alert>
                </>
              )}

              {!currentUser && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Please login to submit your order
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmitOrder}
                disabled={!currentUser || isSubmitting || !deliveryAddress.trim() || !contactNumber.trim()}
                sx={{
                  backgroundColor: '#D4AF37',
                  '&:hover': { backgroundColor: '#B8860B' },
                  mb: 2
                }}
              >
                {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Cart; 