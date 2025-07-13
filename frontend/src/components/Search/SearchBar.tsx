import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

/**
 * SearchBar Component
 * -------------------
 * A reusable search input field for filtering URL entries.
 * - Includes a search icon inside the input field.
 * - Accepts a `query` string and a change handler.
 */
export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <TextField
      label="Search URLs"
      value={query}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      size="small"
      fullWidth
      sx={{ maxWidth: 400 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
