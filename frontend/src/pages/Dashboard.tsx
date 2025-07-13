// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Stack,
  TextField,
  InputAdornment,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRecoilState } from 'recoil';
import { urlListState } from '../state/urls';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import FilterBar from '../components/Filter/FilterBar';

type Order = 'asc' | 'desc';

export default function Dashboard() {
  const [urls, setUrls] = useRecoilState(urlListState);
  const [newUrl, setNewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ htmlVersion: '', status: '', loginForm: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<string>('title');
  const [order, setOrder] = useState<Order>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUrls();
    const interval = setInterval(fetchUrls, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await api.get('/urls');
      setUrls(res.data);
    } catch (err) {
      console.error('Failed to fetch URLs', err);
    }
  };

  const submitUrl = async () => {
    if (!newUrl.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/urls', { url: newUrl.trim() });
      setNewUrl('');
      fetchUrls();
      toast.success('URL submitted');
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/urls/${id}`)));
      setSelectedIds([]);
      fetchUrls();
      toast.success('URLs deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const bulkReanalyze = async () => {
    try {
      await Promise.all(selectedIds.map((id) => api.post(`/urls/${id}/reanalyze`)));
      setSelectedIds([]);
      fetchUrls();
      toast.success('Re-analysis started');
    } catch (err) {
      toast.error('Re-analyze failed');
    }
  };

  const bulkCancel = async () => {
    try {
      await Promise.all(selectedIds.map((id) => api.post(`/urls/${id}/cancel`)));
      setSelectedIds([]);
      fetchUrls();
      toast.success('Canceled');
    } catch (err) {
      toast.error('Cancel failed');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredUrls = urls.filter((url) => {
    const matchesSearch =
      url.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.url?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHtml = !filters.htmlVersion || url.html_version === filters.htmlVersion;
    const matchesStatus = !filters.status || url.status === filters.status;
    const matchesLogin =
      !filters.loginForm ||
      (filters.loginForm === 'yes' && url.login_form_found) ||
      (filters.loginForm === 'no' && !url.login_form_found);
    return matchesSearch && matchesHtml && matchesStatus && matchesLogin;
  });

  const sortedUrls = [...filteredUrls].sort((a, b) => {
    const aVal = (a as any)[orderBy];
    const bVal = (b as any)[orderBy];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return order === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
    <Container maxWidth="xl" sx={{ pt: 6 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
        Analyzed URLs Dashboard
      </Typography>

      {/* Input Section */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    alignItems="center"
    justifyContent="space-between"
  >
    <TextField
      fullWidth
      variant="outlined"
      label="Enter website URL"
      value={newUrl}
      onChange={(e) => setNewUrl(e.target.value)}
      sx={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        maxWidth: { sm: '500px' },
        '& .MuiOutlinedInput-root': {
          borderRadius: '20px',
        },
      }}
    />
    <Button
      type="submit"
      variant="contained"
      onClick={submitUrl}
      disabled={submitting}
      sx={{
        whiteSpace: 'nowrap',
        px: 4,
        py: 1.5,
        background: 'linear-gradient(to right, #0F5C96, #1976d2)',
        boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
        fontWeight: 600,
        borderRadius: '30px',
        textTransform: 'none',
        '&:hover': {
          background: 'linear-gradient(to right, #0c4a75, #1565c0)',
        },
      }}
    >
      {submitting ? 'Submitting...' : 'Add URL'}
    </Button>
  </Stack>
</Paper>

      {/* Search and Filter */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" mb={3} spacing={2}>
        <TextField
          variant="outlined"
          placeholder="Search by URL or Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
            },
          }}
        />
        <FilterBar filters={filters} setFilters={setFilters} />
      </Stack>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Stack direction="row" spacing={2} mb={2}>
          <Button onClick={bulkReanalyze} variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
            Re-analyze
          </Button>
          <Button onClick={bulkDelete} variant="contained" color="error" sx={{ borderRadius: '20px' }}>
            Delete
          </Button>
          <Button onClick={bulkCancel} variant="contained" color="secondary" sx={{ borderRadius: '20px' }}>
            Cancel
          </Button>
        </Stack>
      )}

      {/* Table Section */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#0F5C96' }}>
              <TableRow>
                <TableCell />
                {[
                  { label: 'Title', key: 'title' },
                  { label: 'HTML', key: 'html_version' },
                  { label: 'Internal', key: 'internal_links' },
                  { label: 'External', key: 'external_links' },
                  { label: 'Broken', key: 'broken_links' },
                  { label: 'Login', key: 'login_form_found' },
                  { label: 'Status', key: 'status' },
                ].map(({ label, key }) => (
                  <TableCell key={key} sx={{ color: '#fff', fontWeight: '700' }}>
                    <TableSortLabel
                      active={orderBy === key}
                      direction={orderBy === key ? order : 'asc'}
                      onClick={() => handleSort(key)}
                      sx={{ color: '#fff', '&.Mui-active': { color: '#fff' } }}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUrls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/details/${item.id}`)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelect(item.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{item.title || '—'}</TableCell>
                  <TableCell>{item.html_version || '—'}</TableCell>
                  <TableCell>{item.internal_links}</TableCell>
                  <TableCell>{item.external_links}</TableCell>
                  <TableCell>{item.broken_links}</TableCell>
                  <TableCell>{item.login_form_found ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#fff',
                        backgroundColor:
                          item.status === 'done'
                            ? 'green'
                            : item.status === 'queued'
                            ? 'orange'
                            : item.status === 'running'
                            ? 'blue'
                            : item.status === 'error'
                            ? 'red'
                            : item.status === 'cancelled'
                            ? 'gray'
                            : 'black',
                      }}
                    >
                      {item.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={sortedUrls.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </Paper>
    </Container>
  );
}
