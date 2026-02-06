import { TradeCard } from "@/components/base-long-card";
import Pagination from "@/components/pagination";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

export default function SearchPage() {
  const router = useRouter();
  const [listings, setListings] = useState(null);
  const [filter, setFilter] = useState(null);
  const [array, setArray] = useState(null);
  const { name, category, condition, since, until, user } = router.query;
  const resultsPerPage = 5;
  const [currP, setCurrP] = useState(0);

  useEffect(() => {
    const effectAsync = async () => {
      const res = await fetch("/api/listings", {
        method: "GET",
        cache: "no-store",
      });
      if (res.ok) {
        const { listings: list } = await res.json();
        setListings(list);
      }
    };
    effectAsync();
  }, []);

  useEffect(() => {
    const effectAsync = async () => {
      if (!listings) return;
      const userRes = await fetch("/api/users", {
        method: "GET",
        cache: "no-store",
      });
      if (userRes.ok) {
        const { users } = await userRes.json();
        const filter = listings.filter((l) => {
          const u = users.find((u) => u._id === l.userId);
          if (!u) return false;
          l.user = u;
          const sinceDate = Date.parse(since);
          const untilDate = Date.parse(until);
          const currDate = Date.parse(l.datePosted);
          return (
            (!name || l.itemName.toLowerCase().includes(name.toLowerCase())) &&
            (!category || l.category === category) &&
            (!condition || l.condition === condition) &&
            (!since || sinceDate <= currDate) &&
            (!until || untilDate >= currDate) &&
            (!user ||
              user ===
                l.user?.username.toLowerCase().includes(user.toLowerCase())) &&
            l.status === "ACTIVE"
          );
        });
        setFilter(filter);
        setCurrP(0);
      }
    };
    effectAsync();
  }, [router.isReady, listings, name, category, condition, since, until, user]);

  useEffect(() => {
    const effectAsync = async () => {
      if (!filter) return;
      console.log(filter);
      const copy = filter.filter((v) => {
        console.log(v.user);
        return v.user;
      });
      const copy2 = copy.slice(
        currP * resultsPerPage,
        currP * resultsPerPage + resultsPerPage,
      );

      setArray(copy2);
      console.log(copy);
    };
    effectAsync();
  }, [currP, filter]);

  return (
    <div className="p-5">
      {array ? (
        <>
          <Pagination
            dataLength={filter.length}
            currPage={currP}
            setCurrPage={setCurrP}
            resultsPerPage={resultsPerPage}
          />
          {array.map((v, idx) => {
            return (
              <TradeCard
                key={idx}
                user={v.user}
                img={v.images[0]}
                offerItem={v}
                requestItem={v.requestItems && v.requestItems[0]}
                requestMoney={v.requestMoney}
                hasMultiple={v.requestItems.length > 1}
                rating={0}
                url={"/listings/" + v._id}
              />
            );
          })}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
