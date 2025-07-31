import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { Search } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../contexts/CartContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { addToCart } = useCart();

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (productsData.length > 0) {
        setProducts(productsData);
      } else {
        // Fallback sample data if no products in Firestore
        setProducts([
          {
            id: '1',
            name: 'Gold Necklace',
            description: 'Beautiful 22K gold necklace with intricate design',
            price: 25000,
            image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
            category: 'Necklace',
            weight: '15.5g',
            purity: '22K',
            rating: 4.5
          },
          {
            id: '2',
            name: 'Gold Ring',
            description: 'Elegant gold ring with diamond accent',
            price: 15000,
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
            category: 'Ring',
            weight: '8.2g',
            purity: '18K',
            rating: 4.8
          },
          {
            id: '3',
            name: 'Gold Bracelet',
            description: 'Stunning gold bracelet with traditional patterns',
            price: 18000,
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
            category: 'Bracelet',
            weight: '12.3g',
            purity: '22K',
            rating: 4.6
          },
          {
            id: '4',
            name: 'Gold Earrings',
            description: 'Delicate gold earrings with pearl details',
            price: 12000,
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
            category: 'Earrings',
            weight: '6.8g',
            purity: '18K',
            rating: 4.7
          },
          {
            id: '5',
            name: 'Gold Chain',
            description: 'Classic gold chain necklace',
            price: 22000,
            image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
            category: 'Necklace',
            weight: '18.5g',
            purity: '22K',
            rating: 4.4
          },
          {
            id: '6',
            name: 'Gold Pendant',
            description: 'Exquisite gold pendant with religious motif',
            price: 9500,
            image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2b9?w=400',
            category: 'Pendant',
            weight: '5.2g',
            purity: '18K',
            rating: 4.9
          },
          {
            id: '7',
            name: 'Traditional Gold Rakhi',
            description: 'Beautiful traditional gold rakhi with intricate design',
            price: 8500,
            image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
            category: 'Rakhi',
            weight: '8.5g',
            purity: '22K',
            rating: 4.8
          },
          {
            id: '8',
            name: 'Diamond Gold Rakhi',
            description: 'Elegant gold rakhi with diamond accents',
            price: 12000,
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
            category: 'Rakhi',
            weight: '12.3g',
            purity: '18K',
            rating: 4.9
          },
          {
            id: '7',
            name: 'Traditional Gold Rakhi',
            description: 'Beautiful traditional gold rakhi with intricate design',
            price: 8500,
            image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
            category: 'Rakhi',
            weight: '8.5g',
            purity: '22K',
            rating: 4.8
          },
          {
            id: '8',
            name: 'Diamond Gold Rakhi',
            description: 'Elegant gold rakhi with diamond accents',
            price: 12000,
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
            category: 'Rakhi',
            weight: '12.3g',
            purity: '18K',
            rating: 4.9
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback sample data on error
      setProducts([
        {
          id: '1',
          name: 'Gold Necklace',
          description: 'Beautiful 22K gold necklace with intricate design',
          price: 25000,
          image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
          category: 'Necklace',
          weight: '15.5g',
          purity: '22K',
          rating: 4.5
        },
        {
          id: '2',
          name: 'Gold Ring',
          description: 'Elegant gold ring with diamond accent',
          price: 15000,
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
          category: 'Ring',
          weight: '8.2g',
          purity: '18K',
          rating: 4.8
        },
        {
          id: '3',
          name: 'Gold Bracelet',
          description: 'Stunning gold bracelet with traditional patterns',
          price: 18000,
          image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
          category: 'Bracelet',
          weight: '12.3g',
          purity: '22K',
          rating: 4.6
        },
        {
          id: '4',
          name: 'Gold Earrings',
          description: 'Delicate gold earrings with pearl details',
          price: 12000,
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
          category: 'Earrings',
          weight: '6.8g',
          purity: '18K',
          rating: 4.7
        },
        {
          id: '5',
          name: 'Gold Chain',
          description: 'Classic gold chain necklace',
          price: 22000,
          image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
          category: 'Necklace',
          weight: '18.5g',
          purity: '22K',
          rating: 4.4
        },
        {
          id: '6',
          name: 'Gold Pendant',
          description: 'Exquisite gold pendant with religious motif',
          price: 9500,
          image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2b9?w=400',
          category: 'Pendant',
          weight: '5.2g',
          purity: '18K',
          rating: 4.9
        },
        {
          id: '7',
          name: 'Traditional Gold Rakhi',
          description: 'Beautiful traditional gold rakhi with intricate design',
          price: 8500,
          image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
          category: 'Rakhi',
          weight: '8.5g',
          purity: '22K',
          rating: 4.8
        },
        {
          id: '8',
          name: 'Diamond Gold Rakhi',
          description: 'Elegant gold rakhi with diamond accents',
          price: 12000,
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
          category: 'Rakhi',
          weight: '12.3g',
          purity: '18K',
          rating: 4.9
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbar({
      open: true,
      message: `${product.name} added to cart!`,
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" sx={{ textAlign: 'center', mt: 4 }}>
          Loading products...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Exquisite Gold Jewelry Collection
      </Typography>
      
      <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
        Discover our premium collection of handcrafted gold jewelry pieces
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search jewelry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Necklace">Necklaces</MenuItem>
                <MenuItem value="Ring">Rings</MenuItem>
                <MenuItem value="Earring">Earrings</MenuItem>
                <MenuItem value="Bracelet">Bracelets</MenuItem>
                <MenuItem value="Pendant">Pendants</MenuItem>
                <MenuItem value="Rakhi">Rakhis</MenuItem>
                <MenuItem value="Chain">Chains</MenuItem>
                <MenuItem value="Anklet">Anklets</MenuItem>
                <MenuItem value="Nose Ring">Nose Rings</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {filteredProducts.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          No products found matching your criteria.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Home; 