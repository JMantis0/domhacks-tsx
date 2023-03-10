import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui-bundle/jquery-ui.css";
import SortableViewer from "./SortableViewer";
import DiscardZoneViewer from "./DiscardZoneViewer";
import { Scrollbars } from "react-custom-scrollbars-2";
import TrashZoneViewer from "./TrashZoneViewer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import OpponentViewer from "./OpponentViewer";
import { setViewerHidden } from "../../redux/contentSlice";

const PrimaryFrame = () => {
  const [currentTurn, setCurrentTurn] = useState("Turn 1");
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const hidden = useSelector((state: RootState) => state.content.viewerHidden);
  const dispatch = useDispatch();
  const [tabs, setTabs] = useState<"Deck" | "Discard" | "Trash" | "Opponent">(
    "Deck"
  );
  const [pinnedTab, setPinnedTab] = useState<
    "Deck" | "Discard" | "Trash" | "Opponent"
  >("Deck");

  const chromeMessageListener = (
    request: { command: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: { response: string }) => void
  ) => {
    console.log(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    );
    console.log("request:", request);
    let response: { response: string } = { response: "" };
    if (request.command === "appendDomRoot") {
      dispatch(setViewerHidden(false));
      response.response = "DomRoot Rendered.";
    } else if (request.command === "removeDomRoot") {
      dispatch(setViewerHidden(true));
      response.response = "DomRoot removed.";
    }
    sendResponse(response);
  };

  const handleTabClick = (e: BaseSyntheticEvent) => {
    const tabName = e.target.name;
    setTabs(tabName);
    setPinnedTab(tabName);
  };

  const handleMouseEnter = (e: BaseSyntheticEvent) => {
    const tabName = e.target.name;
    setTabs(tabName);
  };

  const handleMouseLeave = () => {
    setTabs(pinnedTab);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(chromeMessageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(chromeMessageListener);
    };
  }, []);

  useEffect(() => {
    $("#primaryFrame").draggable().resizable({ handles: "all" });
  }, []);

  useEffect(() => {
    for (let i = pd.logArchive.length - 1; i >= 0; i--) {
      if (pd.logArchive[i].match("Turn ") !== null) {
        setCurrentTurn(pd.logArchive[i].slice(0, 10).trim());
        break;
      }
    }
  }, [pd, tabs]);

  return (
    <React.Fragment>
      <div
        id="primaryFrame"
        className={`${
          hidden ? "hidden" : ""
        } bg-black/[.85] w-[200px] h-[200px] overflow-hidden pt-[40px] pb-[20px] border-8 border-double border-gray-300 box-border pb-[44px]`}
      >
        <div className="text-xs mt-[-44px] text-white grid grid-cols-12">
          <div
            className={`h-full w-full align-center col-span-4 whitespace-nowrap`}
          >
            {currentTurn}
          </div>
          <div className={`col-span-4 whitespace-nowrap`}>
            <button
              className="align-center w-full h-full border-2 whitespace-nowrap"
              onClick={() => {
                console.log(pd);
              }}
            >
              c.log pdeck
            </button>
          </div>
          <div className="col-span-4">
            <button
              className="w-full h-full border-2 whitespace-nowrap"
              onClick={() => {
                console.log(od);
              }}
            >
              c.log odeck
            </button>
          </div>
        </div>

        <main className="text-white grid grid-cols-12 mb-[10px] border-t-2">
          <button
            className={`col-span-6 border-box h-full text-xs whitespace-nowrap w-full ${
              tabs === "Deck" ? null : "border-b-2"
            } ${pinnedTab === "Deck" ? "text-lime-500" : null}`}
            onClick={handleTabClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            name="Deck"
          >
            Deck {pd.library.length} / {pd.entireDeck.length}
          </button>
          <button
            className={`col-span-6 border-box h-full text-xs whitespace-nowrap w-full border-l-2 ${
              tabs === "Opponent" ? null : "border-b-2"
            } ${pinnedTab === "Opponent" ? "text-lime-500" : null}`}
            onClick={handleTabClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            name="Opponent"
          >
            Opponent {od.entireDeck.length}
          </button>
        </main>
        <Scrollbars
          autoHide={false}
          renderThumbVertical={({ style, ...props }) => (
            <main
              {...props}
              style={{
                ...style,
                backgroundColor: "#e9e9e9",
                width: "3px",
                opacity: ".75",
                height: "30px",
              }}
            />
          )}
        >
          <div className="p-1 mr-2">
            {tabs === "Deck" && <SortableViewer />}
            {tabs === "Discard" && <DiscardZoneViewer />}
            {tabs === "Opponent" && <OpponentViewer />}
            {tabs === "Trash" && <TrashZoneViewer />}
            <button
              onClick={() => {
                console.log("hidden is", hidden);
              }}
            >
              log hidden
            </button>
          </div>
        </Scrollbars>
        <div
          className={`grid grid-cols-12 text-white absolute bottom-0 w-full`}
        >
          <button
            className={`col-span-6  h-full text-xs whitespace-nowrap w-full ${
              tabs === "Discard" ? null : "border-t-2"
            } ${pinnedTab === "Discard" ? "text-lime-500" : null}`}
            onClick={handleTabClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            name="Discard"
          >
            Discard {pd.graveyard.length}
          </button>
          <button
            className={`col-span-6 border-box h-full text-xs whitespace-nowrap w-full border-l-2 ${
              tabs === "Trash" ? null : "border-t-2"
            } ${pinnedTab === "Trash" ? "text-lime-500" : null}`}
            onClick={handleTabClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            name="Trash"
          >
            Trash {pd.trash.length}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
