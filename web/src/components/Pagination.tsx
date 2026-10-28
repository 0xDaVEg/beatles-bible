import { Link } from 'react-router-dom';
import type { ArchiveItem } from '../lib/archive';
import { pagePath } from '../lib/archive';

interface PaginationProps {
  item: ArchiveItem;
}

function Pagination({ item }: PaginationProps) {
  if (item.totalPages <= 1) return null;

  const pages = Array.from({ length: item.totalPages }, (_, index) => index + 1);

  return (
    <nav className="detail-pagination" aria-label="Page navigation">
      <span className="pagination-label">
        Page {item.page} of {item.totalPages}:
      </span>
      {pages.map((page) =>
        page === item.page ? (
          <span key={page} className="pagination-link current" aria-current="page">
            {page}
          </span>
        ) : (
          <Link key={page} to={pagePath(item.parentPath, page)} className="pagination-link">
            {page}
          </Link>
        ),
      )}
    </nav>
  );
}

export default Pagination;
