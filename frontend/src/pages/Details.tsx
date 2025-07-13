// React and routing imports
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Axios instance for API calls
import api from '../api/api';

// MUI Components for UI
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Stack,
  useTheme,
} from '@mui/material';

// Recharts for pie chart visualization
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Custom colors for the pie chart slices
const COLORS = ['#4e79a7', '#f28e2b'];

export default function Details() {
  const { id } = useParams(); // Get URL ID from route parameters
  const [data, setData] = useState<any>(null); // Store fetched data
  const [loading, setLoading] = useState(true); // Show loader while fetching
  const theme = useTheme(); // Use MUI theme for consistent styling

  // Fetch data for the specific URL when component mounts or id changes
  useEffect(() => {
    if (!id) return;

    api
      .get(`/urls/${id}`)
      .then((res) => {
        setData(res.data); // Set the URL analysis data
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching detail:', err);
        setLoading(false);
      });
  }, [id]);

  // Display a loading spinner while fetching
  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress color="primary" />
      </Box>
    );

  // Show error message if no data is returned
  if (!data?.url)
    return (
      <Typography color="error" align="center" py={10}>
        No data found for this URL.
      </Typography>
    );

  // Destructure useful fields from API response
  const { url, broken_links } = data;

  // Prepare data for pie chart
  const pieData = [
    { name: 'Internal Links', value: url.internal_links || 0 },
    { name: 'External Links', value: url.external_links || 0 },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Outer paper wrapper */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* Page title */}
        <Typography variant="h4" fontWeight={700} mb={4} color="primary">
          Website Analysis Report
        </Typography>

        {/* Main section with text and chart */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            mb: 5,
          }}
        >
          {/* Textual analysis summary */}
          <Box flex={1}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {url.title || url.url}
            </Typography>

            {/* Metadata chips */}
            <Stack spacing={1}>
              <Box>
                <Chip label={`HTML Version: ${url.html_version || '—'}`} color="primary" />
              </Box>
              <Box>
                <Chip label={`Broken Links: ${url.broken_links}`} color="error" />
              </Box>
              <Box>
                <Chip
                  label={`Login Form: ${url.login_form_found ? 'Yes' : 'No'}`}
                  color={url.login_form_found ? 'success' : 'default'}
                />
              </Box>
            </Stack>
          </Box>

          {/* Pie chart */}
          <Box flex={1} minHeight={300}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {/* Chart slice color mapping */}
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Broken links section */}
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Broken Links
        </Typography>

        <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', p: 2 }}>
          <List disablePadding>
            {broken_links.map((link: any) => (
              <ListItem
                key={link.id}
                sx={{
                  display: 'block',
                  px: 0,
                  py: 1,
                  borderBottom: '1px solid #eee',
                }}
              >
                {/* Broken link info */}
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        color: 'error.main',
                        fontSize: '0.9rem',
                      }}
                    >
                      {link.link}
                    </Box>
                  }
                  secondary={`Status: ${link.status}`}
                  secondaryTypographyProps={{
                    fontSize: '0.8rem',
                    color: 'text.secondary',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Paper>
    </Container>
  );
}
