import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { urlListState } from '../state/urls';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [urls, setUrls] = useRecoilState(urlListState);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/urls').then(res => setUrls(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analyzed URLs</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">HTML Version</th>
            <th className="p-2 border">Internal</th>
            <th className="p-2 border">External</th>
            <th className="p-2 border">Broken</th>
            <th className="p-2 border">Login Form</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((item: any) => (
            <tr
              key={item.id}
              className="hover:bg-blue-50 cursor-pointer"
              onClick={() => navigate(`/details/${item.id}`)}
            >
              <td className="p-2 border">{item.title || '(Untitled)'}</td>
              <td className="p-2 border">{item.html_version}</td>
              <td className="p-2 border">{item.internal_links}</td>
              <td className="p-2 border">{item.external_links}</td>
              <td className="p-2 border">{item.broken_links}</td>
              <td className="p-2 border">{item.login_form_found ? 'Yes' : 'No'}</td>
              <td className="p-2 border">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
