import { atom } from 'recoil';

// Define the structure for a URL item stored in the state
export interface UrlItem {
  id: number;
  url: string;
  title: string;
  html_version: string;
  internal_links: number;
  external_links: number;
  broken_links: number;
  login_form_found: boolean;
  status: string;
}

// Create a Recoil atom to hold the list of URLs globally
export const urlListState = atom<UrlItem[]>({
  key: 'urlListState',  // unique key to identify this state atom
  default: [],          // initial value is an empty array
});
