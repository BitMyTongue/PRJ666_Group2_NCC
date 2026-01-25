import { forwardRef } from "react";
import { Button, Dropdown } from "react-bootstrap";
import UserIcon from "../user-icon";

const CustomToggle = forwardRef(function CustomToggle(
  { children, onClick },
  ref,
) {
  return (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  );
});

const CustomMenu = forwardRef(function CustomMenu(
  { children, style, className },
  ref,
) {
  return (
    <div ref={ref} style={style} className={className}>
      <Button variant="primary mx-2 mt-1 mb-3">Create Listing</Button>
      <ul className="list-unstyled">{children}</ul>
    </div>
  );
});
export default function CurrentUserDropdown({ user, handleLogout }) {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="current-user-dropdown">
        <UserIcon user={user.username} img={user.avatar} size={40} />
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu}>
       <Dropdown.Item as="button" className="btn btn-primary" href="#">
          View Your Store Page
        </Dropdown.Item>
        <Dropdown.Item as="button" className="btn btn-primary" href="#">
          View Your Listings
        </Dropdown.Item>
        <Dropdown.Item as="button" className="btn btn-primary" href="#">
          View Your Trade History
        </Dropdown.Item>
        <Dropdown.Item as="button" className="btn btn-primary" href="#">
          View Your Bookmarks
        </Dropdown.Item>
        <Dropdown.Item
          className="btn btn-primary w-100 mb-2"
          href={`/users/${user._id}`}
        >
          View Your Profile
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          className="btn btn-danger w-100 mt-2"
          onClick={handleLogout}
        >
          <strong>Log Out</strong>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
