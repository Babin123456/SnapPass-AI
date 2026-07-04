import React, { useState, useEffect, useCallback } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import './HistoryPage.css';

const HistoryPage = () => {
  useDocumentMeta({ title: 'Photo History', description: 'View your previously processed passport photos.' });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: '20' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/upload-history?${params}`);
      const json = await res.json();
      if (json.success) {
        setItems(json.history);
        setPagination(json.pagination);
      }
    } catch (err) {
      console.error('[HistoryPage] Fetch error:', err);
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return (
    <div className="history-page">
      <h1>Photo History</h1>

      <div className="history-filters">
        <input
          type="text"
          placeholder="Search by filename..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="history-search-input"
          aria-label="Search upload history"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="history-status-select"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && (
        <p className="history-empty">No upload history found.</p>
      )}

      <div className="history-list">
        {items.map((item) => (
          <div key={item._id} className="history-item">
            <span className="history-filename">{item.filename || item.originalImage}</span>
            <span className={`history-status history-status--${item.status}`}>{item.status || 'unknown'}</span>
            <span className="history-date">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
          </div>
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="history-pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span>Page {pagination.page} of {pagination.pages}</span>
          <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
