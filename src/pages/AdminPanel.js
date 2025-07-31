import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Chip,
  IconButton
} from '@mui/material';
import { Add, LocalShipping, Delete, Category } from '@mui/icons-material';
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AdminPanel() {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    weight: '',
    image: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [categories, setCategories] = useState(['Necklace', 'Ring', 'Earring', 'Bracelet', 'Pendant', 'Rakhi']);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        rating: 4.5,
        reviews: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'products'), productData);
      
      setSnackbar({
        open: true,
        message: 'Product added successfully!',
        severity: 'success'
      });
      
      setOpenProductDialog(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        weight: '',
        image: ''
      });
      
      fetchProducts();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding product: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      
      setSnackbar({
        open: true,
        message: 'Product deleted successfully!',
        severity: 'success'
      });
      
      fetchProducts();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting product: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setOpenCategoryDialog(false);
      setSnackbar({
        open: true,
        message: 'Category added successfully!',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Category already exists or is empty!',
        severity: 'warning'
      });
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat !== categoryToDelete));
      setSnackbar({
        open: true,
        message: 'Category deleted successfully!',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Cannot delete the last category!',
        severity: 'warning'
      });
    }
  };

  const handleDispatchOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'dispatched',
        dispatchedAt: serverTimestamp()
      });
      
      setSnackbar({
        open: true,
        message: 'Order dispatched successfully!',
        severity: 'success'
      });
      
      // Refresh orders
      fetchOrders();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error dispatching order: ' + error.message,
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'dispatched': return 'info';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Admin Panel
      </Typography>

      <Paper sx={{ width: '100%' }}>
                 <Tabs
           value={tabValue}
           onChange={(e, newValue) => setTabValue(newValue)}
           sx={{ borderBottom: 1, borderColor: 'divider' }}
         >
           <Tab label="Products" />
           <Tab label="Categories" />
           <Tab label="Orders" />
         </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Manage Products</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenProductDialog(true)}
              sx={{
                backgroundColor: '#D4AF37',
                '&:hover': { backgroundColor: '#B8860B' }
              }}
            >
              Add Product
            </Button>
          </Box>

                     <Grid container spacing={3}>
             {products.map((product) => (
               <Grid item xs={12} sm={6} md={4} key={product.id}>
                 <Card>
                   <CardContent>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                       <Typography variant="h6" gutterBottom>
                         {product.name}
                       </Typography>
                       <IconButton
                         color="error"
                         size="small"
                         onClick={() => handleDeleteProduct(product.id)}
                         sx={{ ml: 1 }}
                       >
                         <Delete />
                       </IconButton>
                     </Box>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                       {product.description}
                     </Typography>
                     <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                       <Chip label={product.category} size="small" />
                       <Chip label={`${product.weight} Gold`} size="small" />
                     </Box>
                     <Typography variant="h6" color="primary">
                       ₹{product.price?.toLocaleString()}
                     </Typography>
                   </CardContent>
                 </Card>
               </Grid>
             ))}
           </Grid>
        </TabPanel>

                 <TabPanel value={tabValue} index={1}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
             <Typography variant="h5">Manage Categories</Typography>
             <Button
               variant="contained"
               startIcon={<Category />}
               onClick={() => setOpenCategoryDialog(true)}
               sx={{
                 backgroundColor: '#D4AF37',
                 '&:hover': { backgroundColor: '#B8860B' }
               }}
             >
               Add Category
             </Button>
           </Box>

           <Grid container spacing={2}>
             {categories.map((category) => (
               <Grid item xs={12} sm={6} md={4} key={category}>
                 <Card>
                   <CardContent>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Typography variant="h6">{category}</Typography>
                       <IconButton
                         color="error"
                         size="small"
                         onClick={() => handleDeleteCategory(category)}
                       >
                         <Delete />
                       </IconButton>
                     </Box>
                   </CardContent>
                 </Card>
               </Grid>
             ))}
           </Grid>
         </TabPanel>

         <TabPanel value={tabValue} index={2}>
           <Typography variant="h5" gutterBottom>
             Customer Orders
           </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                                 <TableRow>
                   <TableCell>Order ID</TableCell>
                   <TableCell>Customer</TableCell>
                   <TableCell>Contact</TableCell>
                   <TableCell>Address</TableCell>
                   <TableCell>Items</TableCell>
                   <TableCell>Total</TableCell>
                   <TableCell>Status</TableCell>
                   <TableCell>Date</TableCell>
                   <TableCell>Actions</TableCell>
                 </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                                         <TableCell>
                       <Typography variant="body2">
                         {order.customerInfo?.name || 'Customer'}
                       </Typography>
                       <Typography variant="caption" color="text.secondary">
                         {order.userEmail}
                       </Typography>
                     </TableCell>
                     <TableCell>
                       <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                         {order.contactNumber || 'No contact provided'}
                       </Typography>
                     </TableCell>
                     <TableCell>
                       <Typography variant="body2" sx={{ maxWidth: 200, wordBreak: 'break-word' }}>
                         {order.deliveryAddress || 'No address provided'}
                       </Typography>
                     </TableCell>
                    <TableCell>
                      {order.items?.length || 0} items
                    </TableCell>
                    <TableCell>
                      ₹{order.total?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {order.status === 'pending' && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<LocalShipping />}
                          onClick={() => handleDispatchOrder(order.id)}
                          sx={{
                            backgroundColor: '#D4AF37',
                            '&:hover': { backgroundColor: '#B8860B' }
                          }}
                        >
                          Dispatch
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Add Product Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                                 <Select
                   value={newProduct.category}
                   label="Category"
                   onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                 >
                   {categories.map((category) => (
                     <MenuItem key={category} value={category}>{category}</MenuItem>
                   ))}
                 </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gold Weight (e.g., 22K)"
                value={newProduct.weight}
                onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            sx={{
              backgroundColor: '#D4AF37',
              '&:hover': { backgroundColor: '#B8860B' }
            }}
          >
            Add Product
          </Button>
        </DialogActions>
             </Dialog>

       {/* Add Category Dialog */}
       <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)} maxWidth="sm" fullWidth>
         <DialogTitle>Add New Category</DialogTitle>
         <DialogContent>
           <TextField
             fullWidth
             label="Category Name"
             value={newCategory}
             onChange={(e) => setNewCategory(e.target.value)}
             placeholder="Enter category name..."
             sx={{ mt: 1 }}
           />
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
           <Button
             onClick={handleAddCategory}
             variant="contained"
             sx={{
               backgroundColor: '#D4AF37',
               '&:hover': { backgroundColor: '#B8860B' }
             }}
           >
             Add Category
           </Button>
         </DialogActions>
       </Dialog>

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

export default AdminPanel; 