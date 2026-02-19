"use client";

import { useState, useRef, useContext, useEffect } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";
import { UserContext } from "@/contexts/UserContext";
// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const YourAppLayout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const { user } = useContext(UserContext);
  const [isClient, setIsClient] = useState(false);

  // Ensure this component only renders on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient && user ? (
    <KnockProvider
      apiKey={"pk_test_toofF_1-0VT8s2bgSiVGWkfCvNfzzCUJV6xG4RHrjBA"}
      //ts-ignore
      user={{ id: user?._id?.toString() || user?.id }} 
    >
      <KnockFeedProvider feedId={"bca9a5f1-1982-433f-bb1f-8269695efcbc"}>
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={(e) => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  ) : (
    <FontAwesomeIcon icon={faBell} color="white" size="2x" role="button" />
  );
};
 export default YourAppLayout;