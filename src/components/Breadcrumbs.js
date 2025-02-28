import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="breadcrumbs-container">
      <div className="breadcrumbs">
        <span>
          <Link to="/" className="breadcrumb-link">Home</Link>
          {pathnames.length > 0 && <span className="breadcrumb-separator"> / </span>}
        </span>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <span key={name}>
              <Link to={routeTo} className="breadcrumb-link">{name}</Link>
              {index < pathnames.length - 1 && <span className="breadcrumb-separator"> / </span>}
            </span>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumbs;