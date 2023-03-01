import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  CardCounts,
  combineDeckListMapAndZoneListMap,
  getCountsFromArray,
  sortTheView,
} from "../../utils/utilityFunctions";
import ZoneCardRow from "./ZoneCardRow";

const HandZoneViewer = () => {
  const firstRender = useRef(true);
  const [combinedMap, setCombinedMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );

  useEffect(() => {
    const unsortedCombinedMap = combineDeckListMapAndZoneListMap(
      getCountsFromArray(pd.entireDeck),
      getCountsFromArray(pd.hand)
    );
    const sortedCombinedMap = sortTheView(
      sortButtonState.category,
      unsortedCombinedMap,
      sortButtonState.sort
    );
    setCombinedMap(sortedCombinedMap);
  }, [pd]);

  useEffect(() => {
    if (firstRender.current) {
      // prevents this useEffect from doing anything on first render.
      firstRender.current = false;
      return;
    }
    setCombinedMap(
      sortTheView(sortButtonState.category, combinedMap, sortButtonState.sort)
    );
  }, [sortButtonState]);

  return (
    <div className="outer-shell">
        {Array.from(combinedMap.keys()).map((card, idx) => {
          return (
            combinedMap.get(card)?.zoneCount! > 0 && (
              <ZoneCardRow
                key={idx}
                cardName={card}
                cardAmountOwned={combinedMap.get(card)?.entireDeckCount!}
                cardAmountInZone={combinedMap.get(card)?.zoneCount!}
              />
            )
          );
        })}
  
    </div>
  );
};

export default HandZoneViewer;
