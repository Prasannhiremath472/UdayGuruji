import Button from './Button';
import './Pagination.css';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <Button variant="ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        &laquo;
      </Button>
      <span className="pagination-status">
        {page} / {totalPages}
      </span>
      <Button variant="ghost" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        &raquo;
      </Button>
    </nav>
  );
}
