import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

export default function Details() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api.get(`/urls/${id}`)
      .then((res) => {
        console.log('Details response:', res.data);  // 🔍 debug
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching detail:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data || !data.url) return <div className="p-6 text-red-600">No data found for this URL.</div>;

  const { url, broken_links } = data;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{url.title}</h1>
      <p className="text-gray-600">HTML Version: {url.html_version}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>Internal Links: {url.internal_links}</div>
        <div>External Links: {url.external_links}</div>
        <div>Broken Links: {url.broken_links}</div>
        <div>Login Form Found: {url.login_form_found ? 'Yes' : 'No'}</div>
        <div>Status: {url.status}</div>
      </div>

      <h2 className="text-xl mt-6">Broken Links</h2>
      <ul className="list-disc pl-6">
        {broken_links.map((link: any, idx: number) => (
          <li key={idx}>
            {link.link} — Status: {link.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
