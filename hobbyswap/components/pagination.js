import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, forwardRef } from "react";
import { Button, Dropdown, Form, Pagination as P } from "react-bootstrap";

/*

    Example page using Pagination

  const resultsPerPage = 5;
  const [currP, setCurrP] = useState(0);
  const [currArr, setCurrArr] = useState([]);

  useEffect(() => {
    const effectAsync = async () => {
      const copy = items.slice(
        currP * resultsPerPage,
        currP * resultsPerPage + resultsPerPage,
      );
      setCurrArr(copy);
    };
    effectAsync();
  }, [currP]);
  return (
    <>
      <Pagination
        dataLength={items.length}
        currPage={currP}
        setCurrPage={setCurrP}
        resultsPerPage={resultsPerPage}
      />
      {currArr.map((v, idx) => (
        <p key={idx}>Test</p>
      ))}
    </>
  );

*/

const CustomMenu = forwardRef(function CustomMenu(
  { children, style, className, currPage, setCurrPage, limit },
  ref,
) {
  const [customNum, setCustomNum] = useState(currPage);
  return (
    <Form
      ref={ref}
      style={style}
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        setCurrPage(customNum);
      }}
    >
      <Form.Control
        className="mb-3"
        type="text"
        defaultValue={currPage}
        onChange={(e) => {
          if (isNaN(e.target.value)) setCustomNum(-1);
          else setCustomNum(parseInt(e.target.value) - 1);
        }}
      />
      <Button
        variant="secondary"
        type="submit"
        disabled={customNum < 0 || customNum > limit - 1}
      >
        Go
      </Button>
    </Form>
  );
});

export default function Pagination({
  dataLength,
  currPage,
  setCurrPage,
  resultsPerPage = 10,
}) {
  const baseLimitPerPage = currPage * resultsPerPage + 1;
  const limitPerPage = (currPage + 1) * resultsPerPage;
  const limit = Math.ceil(dataLength / resultsPerPage);

  return (
    <div className="d-flex justify-content-between">
      <span>
        Showing {baseLimitPerPage > dataLength ? dataLength : baseLimitPerPage}{" "}
        - {limitPerPage > dataLength ? dataLength : limitPerPage} out of{" "}
        {dataLength}
      </span>
      <div className="d-flex gap-5 justify-content-between">
        <P>
          <P.First
            disabled={currPage <= 0}
            onClick={() => {
              setCurrPage(0);
            }}
          />
          <P.Prev
            disabled={currPage <= 0}
            onClick={() => {
              setCurrPage(currPage - 1);
            }}
          />

          {currPage > 1 && (
            <P.Item
              onClick={() => {
                setCurrPage(currPage - 2);
              }}
            >
              {currPage - 1}
            </P.Item>
          )}
          {currPage > 0 && (
            <P.Item
              onClick={() => {
                setCurrPage(currPage - 1);
              }}
            >
              {currPage}
            </P.Item>
          )}
          <P.Item active>{currPage + 1}</P.Item>
          {currPage < limit - 1 && (
            <P.Item
              onClick={() => {
                setCurrPage(currPage + 1);
              }}
            >
              {currPage + 2}
            </P.Item>
          )}
          {currPage < limit - 2 && (
            <P.Item
              onClick={() => {
                setCurrPage(currPage + 2);
              }}
            >
              {currPage + 3}
            </P.Item>
          )}

          <P.Next
            disabled={currPage >= limit - 1}
            onClick={() => {
              setCurrPage(currPage + 1);
            }}
          />
          <P.Last
            disabled={currPage >= limit - 1}
            onClick={() => {
              setCurrPage(limit - 1);
            }}
          />
        </P>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">
            <FontAwesomeIcon icon={faEllipsis} />
          </Dropdown.Toggle>

          <Dropdown.Menu
            as={CustomMenu}
            currPage={currPage}
            setCurrPage={setCurrPage}
            limit={limit}
            className="p-3"
          ></Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}
