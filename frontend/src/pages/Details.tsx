import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/api';
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

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#4e79a7', '#f28e2b'];

export default function Details() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (!id) return;
    api
      .get(`/urls/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching detail:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (!data?.url)
    return (
      <Typography color="error" align="center" py={10}>
        No data found for this URL.
      </Typography>
    );

  const { url, broken_links } = data;

  const pieData = [
    { name: 'Internal Links', value: url.internal_links || 0 },
    { name: 'External Links', value: url.external_links || 0 },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={4} color="primary">
          Website Analysis Report
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            mb: 5,
          }}
        >
          <Box flex={1}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {url.title || url.url}
            </Typography>

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
