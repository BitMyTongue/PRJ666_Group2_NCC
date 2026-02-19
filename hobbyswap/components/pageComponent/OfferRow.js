import { useEffect, useState } from "react";
import { StatusCard, StatusType } from "../base-long-card";
import ProposalCard from "../long-proposal.card";

export function OfferRow({ offer, listing }) {
  const [requestUser, setRequestUser] = useState(null);
  console.log(offer.requesterId);
  const statusMap = {
    PENDING: StatusType.RES_NEEDED,
    DECLINED: StatusType.DECLINED,
    ACCEPTED: StatusType.IN_PROGRESS,
    RETRACTED: StatusType.CANCELLED,
  };
  const currentStatus = statusMap[offer.offerStatus] || StatusType.RES_NEEDED;

  useEffect(() => {
    const loadRequestUser = async () => {
      try {
        const res = await fetch(`/api/users/${offer.requesterId}`);
        const data = await res.json();

        setRequestUser(data);
      } catch (e) {
        console.error(e);
      }
    };
    if (offer.requesterId) loadRequestUser();
  }, [offer.requesterId]);
  if (!requestUser) {
    return (
      <div className="col-12 p-3 text-muted border-bottom">
        <div
          className="spinner-border spinner-border-sm me-2"
          role="status"
        ></div>
        Loading offer details...
      </div>
    );
  }
  return (
    <div className="col-12 p-2">
      {/* <StatusCard
        requestMoney={offer.proposedMoney}
        requestUser={requestUser}
        user={requestUser}
        offerItem={listing}
        statusType={currentStatus}
      /> */}
      <ProposalCard
        offerObj={offer}
        fromUser={requestUser}
        proposedItems={offer.proposedItems}
        proposedMoney={offer.proposedMoney}
      />
    </div>
  );
}
