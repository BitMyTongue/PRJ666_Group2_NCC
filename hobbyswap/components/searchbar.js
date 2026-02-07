import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Dropdown,
  DropdownDivider,
  Form,
  Modal,
} from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SearchContext } from "@/contexts/SearchContext";

export default function SearchBar({ ...props }) {
  const router = useRouter();

  const { history, addToHistory, searchItem, setSearchItem } =
    useContext(SearchContext);
  const [searchUserName, setSearchUserName] = useState("");
  const [searchCondition, setSearchCondition] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchSince, setSearchSince] = useState("");
  const [searchUntil, setSearchUntil] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (str) => {
    const uri = "/search?";
    const queries = [];
    if (str) {
      queries.push("name=" + str);
      addToHistory(str);
    } else if (searchItem) {
      queries.push("name=" + searchItem);
      addToHistory(searchItem);
    }
    if (showModal) {
      if (searchUserName) {
        queries.push("user=" + searchUserName);
      }
      if (searchCondition) {
        queries.push("condition=" + searchCondition);
      }
      if (searchCategory) {
        queries.push("category=" + searchCategory);
      }
      if (searchSince) {
        queries.push("since=" + searchSince);
      }
      if (searchUntil) {
        queries.push("until=" + searchUntil);
      }
    }

    const queryCombined = queries.join("&");
    setShowModal(false);
    router.push(uri + queryCombined);
  };

  useEffect(() => {}, [history]);
  return (
    <div {...props}>
      <Form
        className="w-100"
        onSubmit={() => {
          handleSubmit();
        }}
      >
        <Dropdown className="p-0 w-100 m-0">
          <Dropdown.Toggle
            as="div"
            className="form-control w-100 rounded-pill search-bar"
            variant="success"
            id="dropdown-basic"
            style={{ maxHeight: "37px" }}
          >
            <input
              className="me-2 search-bar border-0"
              type="search"
              aria-label="Search"
              value={searchItem}
              style={{ width: "90%" }}
              onChange={(e) => {
                setSearchItem(e.target.value);
              }}
            />
            <FontAwesomeIcon
              icon={faSearch}
              role="button"
              className=" position-absolute end-0 translate-middle-y me-3 text-primary"
              style={{ top: 18 }}
              onClick={() => {
                handleSubmit();
              }}
            />
          </Dropdown.Toggle>

          <Dropdown.Menu className="w-100">
            {history.map((v, idx) => {
              return (
                <Dropdown.Item
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchItem(v);
                    handleSubmit(v);
                  }}
                >
                  {v}
                </Dropdown.Item>
              );
            })}
            <DropdownDivider />
            <Dropdown.Item
              type="button"
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              <strong>Advanced Search</strong>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Form>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        backdrop="static"
        keyboard={true}
      >
        <Form
          className="w-100"
          onSubmit={() => {
            handleSubmit();
            router.reload();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title className="h1 text-uppercase color-primary">
              Advanced Search
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="my-3">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                value={searchItem}
                onChange={(e) => {
                  setSearchItem(e.target.value);
                }}
              />
            </Form.Group>
            <hr className="my-4" />
            <Form.Group className="my-3">
              <Form.Label>User</Form.Label>
              <Form.Control
                onChange={(e) => {
                  setSearchUserName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Condition</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setSearchCondition(e.target.value);
                }}
              >
                <option value="">Any</option>
                <option value="NEW">NEW</option>
                <option value="USED">USED</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setSearchCategory(e.target.value);
                }}
              >
                <option value="">Any</option>
                <option value="POKEMON CARD">POKEMON</option>
                <option value="BLIND BOX">BLIND BOX</option>
                <option value="YUGIOH CARD">YUGIOH CARD</option>
                <option value="FIGURINE">FIGURINE</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2 w-100">
              <Form.Group className="my-3 w-100">
                <Form.Label>Since</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => {
                    setSearchSince(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="my-3 w-100">
                <Form.Label>Until</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => {
                    setSearchUntil(e.target.value);
                  }}
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
