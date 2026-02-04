import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import { forwardRef, useContext } from "react";
import { Dropdown } from "react-bootstrap";
import ReportUserModal from "../modals/report-user-modal";

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

export default function StoreOptionsDropdown({ userId }) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [reportShow, setReportShow] = useState();
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="store-options">
          <svg width="47" height="46" viewBox="0 0 47 46" fill="none">
            <rect width="47" height="46" rx="23" fill="#001F54" />
            <rect width="47" height="46" rx="23" fill="#001F54" />
            <path
              d="M23.5 24.5832C24.3515 24.5832 25.0417 23.8743 25.0417 22.9998C25.0417 22.1254 24.3515 21.4165 23.5 21.4165C22.6486 21.4165 21.9584 22.1254 21.9584 22.9998C21.9584 23.8743 22.6486 24.5832 23.5 24.5832Z"
              stroke="#F5F5F5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M34.2917 24.5832C35.1431 24.5832 35.8334 23.8743 35.8334 22.9998C35.8334 22.1254 35.1431 21.4165 34.2917 21.4165C33.4402 21.4165 32.75 22.1254 32.75 22.9998C32.75 23.8743 33.4402 24.5832 34.2917 24.5832Z"
              stroke="#F5F5F5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.7084 24.5832C13.5598 24.5832 14.25 23.8743 14.25 22.9998C14.25 22.1254 13.5598 21.4165 12.7084 21.4165C11.8569 21.4165 11.1667 22.1254 11.1667 22.9998C11.1667 23.8743 11.8569 24.5832 12.7084 24.5832Z"
              stroke="#F5F5F5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            as="button"
            className="btn btn-primary"
            href="#/action-1"
            onClick={() => {
              if (user) {
                router.push("/message/user=" + userId);
              } else router.push("/login");
            }}
          >
            Message User
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            className="btn btn-danger"
            href="#/action-2"
            onClick={() => {
              if (user) {
                setReportShow(true);
              } else router.push("/login");
            }}
          >
            Report User
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ReportUserModal
        user={userId}
        show={reportShow}
        setShow={setReportShow}
      />
    </>
  );
}
