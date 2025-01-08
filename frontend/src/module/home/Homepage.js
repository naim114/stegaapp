import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { format } from 'date-fns';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

// News API Configuration
const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = '4d23b5f4e6f142d6a097668d458de48d';
const CATEGORIES = ['cybersecurity'];

// Styled Components
const StyledSlider = styled(Slider)(({ theme }) => ({
  '.slick-dots li button:before': {
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  },
  '.slick-dots li.slick-active button:before': {
    color: theme.palette.primary.main,
  },
  '.slick-prev, .slick-next': {
    zIndex: 1,
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    '&:before': {
      fontSize: '20px',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '.slick-prev': {
    left: '-18px',
  },
  '.slick-next': {
    right: '-18px',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    cursor: 'pointer',
  },
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const StyledCardContent2 = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  // height: '120px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

function Home() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  const fetchArticles = async () => {
    setLoading(true); // Start loading
    try {
      const requests = CATEGORIES.map(category =>
        axios.get(NEWS_API_URL, {
          params: {
            apiKey: API_KEY,
            q: category,
            language: 'en',
          },
        })
      );

      // Execute all requests concurrently
      const responses = await Promise.all(requests);

      // Combine articles from all responses
      const allArticles = responses.flatMap(response => response.data.articles);

      // Filter out articles with `[Removed]` attributes
      const filteredArticles = allArticles.filter(article =>
        article.title !== '[Removed]' &&
        article.description !== '[Removed]' &&
        article.content !== '[Removed]' &&
        article.author !== '[Removed]' &&
        article.urlToImage !== '[Removed]'
      );

      setArticles(filteredArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCardClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Backdrop with CircularProgress */}
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!loading && (
        <>
          <Typography component="h2" variant="h4" sx={{ mb: 1 }}>
            Welcome to DeStegAi
          </Typography>
          <Box>
            <StyledSlider {...sliderSettings}>
              {articles.slice(0, 5).map((article, index) => (
                <Box key={index} sx={{ padding: 1 }}>
                  <StyledCard onClick={() => handleCardClick(article)}>
                    <CardMedia
                      component="img"
                      image={article.urlToImage || 'https://via.placeholder.com/1200x800'}
                      alt={article.source.name}
                      sx={{
                        aspectRatio: '16/9',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <StyledCardContent>
                      <Typography variant="caption">{article.source.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {article.title}
                      </Typography>
                    </StyledCardContent>
                  </StyledCard>
                </Box>
              ))}
            </StyledSlider>
          </Box>
          <Typography component="h3" variant="h5" sx={{ mb: 2, mt: 2 }}>
            More Articles
          </Typography>
          <Grid container spacing={4}>
            {articles.map((article, index) => (
              <Grid item xs={12} md={6} key={index}>
                <StyledCard onClick={() => handleCardClick(article)}>
                  <CardMedia
                    component="img"
                    image={article.urlToImage || 'https://via.placeholder.com/1200x800'}
                    alt={article.source.name}
                    sx={{
                      aspectRatio: '16/9',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <StyledCardContent2>
                    <Typography variant="caption">{article.source.name}</Typography>
                    <Typography variant="h6">{article.title}</Typography>
                    <StyledTypography variant="body2" color="textSecondary">
                      {article.description}
                    </StyledTypography>
                  </StyledCardContent2>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 2,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
                    >
                      <Typography variant="caption">
                        {article.author}
                      </Typography>
                    </Box>
                    <Typography variant="caption">
                      {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
                    </Typography>
                  </Box>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Dialog open={!!selectedArticle} onClose={handleCloseModal} fullScreen>
        {selectedArticle && (
          <Box sx={{ padding: 4 }}>
            <IconButton
              onClick={handleCloseModal}
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
            >
              <CloseIcon />
            </IconButton>
            <CardMedia
              component="img"
              image={selectedArticle.urlToImage || 'https://via.placeholder.com/1200x800'}
              alt={selectedArticle.source.name}
              sx={{ width: '100%', maxHeight: 500, objectFit: 'cover', marginBottom: 2 }}
            />
            <Typography variant="h5" color="textSecondary" gutterBottom>
              {selectedArticle.source.name}
            </Typography>
            <Typography variant="h4" gutterBottom>
              {selectedArticle.title}
            </Typography>
            <Typography variant="h6">
              By {selectedArticle.author}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ fontStyle: 'italic' }}>
              {format(new Date(selectedArticle.publishedAt), 'MMMM d, yyyy')}
            </Typography>
            <Typography variant="body1">
              {selectedArticle.description}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {selectedArticle.content}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }} color="textSecondary">
              Read the full article at{' '}
              <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                {selectedArticle.url}
              </a>
            </Typography>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

export default Home;
