import { NavLink } from "react-router-dom";

export default function SellerSidebar() {
  const links = [
    { to: "/seller", label: "Dashboard", end: true },
    { to: "/seller/products", label: "Products" },
    { to: "/seller/products/new", label: "Add Product" },
    { to: "/seller/orders", label: "Orders" },
  ];

  return (
    <aside className="seller-sidebar">
      <h3>Seller Panel</h3>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
