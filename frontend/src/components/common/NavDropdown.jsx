import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import './NavDropdown.css';

/**
 * Desktop hover/click dropdown used in the public header for grouping
 * related tools (e.g. Consultations, Free Services), mirroring the
 * mega-menu pattern of dropdown + plain-link items side by side.
 */
export default function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="nav-dropdown"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label} <FaChevronDown aria-hidden="true" className="nav-dropdown-chevron" />
      </button>
      {open ? (
        <div className="nav-dropdown-menu">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-dropdown-item"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
