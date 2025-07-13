import { atom } from 'recoil';

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

export const urlListState = atom<UrlItem[]>({
  key: 'urlListState',
  default: [],  // start with an empty array of UrlItem
});