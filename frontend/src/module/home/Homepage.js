import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
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


const cardData = [
  {
    img: 'https://picsum.photos/800/450?random=1',
    tag: 'Engineering',
    title: 'Revolutionizing software development with cutting-edge tools',
    description:
      'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
    authors: [
      { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
      { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
    ],
  },
  {
    img: 'https://picsum.photos/800/450?random=2',
    tag: 'Product',
    title: 'Innovative product features that drive success',
    description:
      'Explore the key features of our latest product release that are helping businesses achieve their goals. From user-friendly interfaces to robust functionality, learn why our product stands out.',
    authors: [{ name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg' }],
  },
  {
    img: 'https://picsum.photos/800/450?random=3',
    tag: 'Design',
    title: 'Designing for the future: trends and insights',
    description:
      'Stay ahead of the curve with the latest design trends and insights. Our design team shares their expertise on creating intuitive and visually stunning user experiences.',
    authors: [{ name: 'Kate Morrison', avatar: '/static/images/avatar/7.jpg' }],
  },
  {
    img: 'https://picsum.photos/800/450?random=4',
    tag: 'Company',
    title: "Our company's journey: milestones and achievements",
    description:
      "Take a look at our company's journey and the milestones we've achieved along the way. From humble beginnings to industry leader, discover our story of growth and success.",
    authors: [{ name: 'Cindy Baker', avatar: '/static/images/avatar/3.jpg' }],
  },
];

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

// Styled Components
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
  height: '80px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const StyledCardContent2 = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '120px',
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

// Components
function Author({ authors }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

function SmallerCard({ data }) {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        image={data.img}
        alt={data.tag}
        sx={{ aspectRatio: '16/9', borderBottom: '1px solid', borderColor: 'divider' }}
      />
      <StyledCardContent>
        <Typography variant="caption">{data.tag}</Typography>
        <Typography variant="body2" color="textSecondary">
          {data.title}
        </Typography>
      </StyledCardContent>
    </StyledCard>
  );
}

SmallerCard.propTypes = {
  data: PropTypes.shape({
    img: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '.MuiPaper-root': {
    width: '100%',
    height: '100%',
    margin: 0,
    borderRadius: 0,
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
  },
}));

const ArticleModalContent = ({ data, onClose }) => (
  <Box sx={{ padding: 4 }}>
    <IconButton
      onClick={onClose}
      sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
    >
      <CloseIcon />
    </IconButton>
    <CardMedia
      component="img"
      image={data.img}
      alt={data.tag}
      sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', marginBottom: 2 }}
    />
    <Typography variant="h4" gutterBottom>
      {data.title}
    </Typography>
    <Typography variant="caption" color="textSecondary" gutterBottom>
      {data.tag}
    </Typography>
    <Typography variant="body1" paragraph>
      {data.description}
    </Typography>
    <Box mt={2}>
      <Author authors={data.authors} />
    </Box>
  </Box>
);

ArticleModalContent.propTypes = {
  data: PropTypes.shape({
    img: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    authors: PropTypes.array.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

// Components
function Home() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleCardClick = (card) => {
    setSelectedArticle(card);
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
      <Typography component="h2" variant="h4" sx={{ mb: 1 }}>
        Welcome to StegoApp
      </Typography>
      <Box>
        <StyledSlider {...sliderSettings}>
          {cardData.map((card, index) => (
            <Box key={index} sx={{ padding: 1 }}>
              <StyledCard onClick={() => handleCardClick(card)}>
                <CardMedia
                  component="img"
                  image={card.img}
                  alt={card.tag}
                  sx={{ aspectRatio: '16/9', borderBottom: '1px solid', borderColor: 'divider' }}
                />
                <StyledCardContent>
                  <Typography variant="caption">{card.tag}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {card.title}
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
        {cardData.slice(0, 5).map((card, index) => (
          <Grid item xs={12} md={6} key={index}>
            <StyledCard onClick={() => handleCardClick(card)}>
              <CardMedia
                component="img"
                image={card.img}
                alt={card.tag}
                sx={{ aspectRatio: '16/9', borderBottom: '1px solid', borderColor: 'divider' }}
              />
              <StyledCardContent2>
                <Typography variant="caption">{card.tag}</Typography>
                <Typography variant="h6">{card.title}</Typography>
                <StyledTypography variant="body2" color="textSecondary">
                  {card.description}
                </StyledTypography>
              </StyledCardContent2>
              <Author authors={card.authors} />
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <StyledDialog open={!!selectedArticle} onClose={handleCloseModal} fullScreen>
        {selectedArticle && (
          <ArticleModalContent data={selectedArticle} onClose={handleCloseModal} />
        )}
      </StyledDialog>
    </Box>
  );
}

export default Home;
