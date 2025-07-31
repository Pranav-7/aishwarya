import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Rating
} from '@mui/material';
import { AddShoppingCart, Favorite } from '@mui/icons-material';

function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image || 'https://via.placeholder.com/300x200?text=Gold+Jewelry'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating || 4.5} precision={0.5} readOnly size="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({product.reviews || 12} reviews)
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip 
            label={`${product.weight || '22K'} Gold`} 
            size="small" 
            sx={{ backgroundColor: '#D4AF37', color: 'white' }}
          />
          <Chip 
            label={product.category || 'Necklace'} 
            size="small" 
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Box>
        
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
          ₹{product.price?.toLocaleString() || '25,000'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddShoppingCart />}
            onClick={handleAddToCart}
            sx={{ 
              flexGrow: 1,
              backgroundColor: '#D4AF37',
              '&:hover': {
                backgroundColor: '#B8860B'
              }
            }}
          >
            Add to Cart
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ minWidth: 'auto' }}
          >
            <Favorite />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCard; 