import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

// Props interface for the FilterBar component
interface FilterBarProps {
  filters: {
    htmlVersion: string;
    status: string;
    loginForm: string;
  };
  setFilters: (filters: FilterBarProps['filters']) => void;
}

// FilterBar component allows filtering the dashboard table based on HTML version, status, and login form presence
export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  // Update filter values when user selects a different option
  const handleChange = (e: SelectChangeEvent) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
      {/* HTML Version Filter */}
      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel>HTML Version</InputLabel>
        <Select
          name="htmlVersion"
          value={filters.htmlVersion}
          label="HTML Version"
          onChange={handleChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="HTML5">HTML5</MenuItem>
          <MenuItem value="HTML4">HTML4</MenuItem>
        </Select>
      </FormControl>

      {/* Status Filter */}
      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={filters.status}
          label="Status"
          onChange={handleChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="queued">Queued</MenuItem>
          <MenuItem value="running">Running</MenuItem>
          <MenuItem value="done">Done</MenuItem>
          <MenuItem value="error">Error</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      {/* Login Form Found Filter */}
      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel>Login Form</InputLabel>
        <Select
          name="loginForm"
          value={filters.loginForm}
          label="Login Form"
          onChange={handleChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
