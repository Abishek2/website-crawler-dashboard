import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { urlListState } from '../state/urls';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [urls, setUrls] = useRecoilState(urlListState);
  const navigate = useNavigate();

  const fetchUrls = async () => {
    try {
      const res = await api.get('/urls');
      setUrls(res.data);
    } catch (err) {
      console.error('Failed to fetch URLs', err);
    }
  };

  useEffect(() => {
    fetchUrls(); // initial fetch

    const interval = setInterval(() => {
      fetchUrls(); // refresh every 5s
    }, 5000);

    return () => clearInterval(interval);
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
    <tr key={item.id} className="cursor-pointer" onClick={() => navigate(`/details/${item.id}`)}>
      <td>{item.title || '—'}</td>
      <td>{item.html_version || '—'}</td>
      <td>{item.internal_links}</td>
      <td>{item.external_links}</td>
      <td>{item.broken_links}</td>
      <td>{item.login_form_found ? 'Yes' : 'No'}</td>
      <td className="text-sm text-blue-600">{item.status}</td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}
