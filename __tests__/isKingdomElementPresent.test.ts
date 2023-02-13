import { beforeAll } from "@jest/globals";
import { expect, jest, describe, it } from "@jest/globals";
import { isKingdomElementPresent } from "../src/content/contentFunctions";

describe("Function isKingdomElementPresent", () => {
  let kingdomElement: HTMLElement;
  describe("when element with class kinddom-viewer-group is present", () => {
    beforeAll(() => {
      kingdomElement = document.createElement("div") as HTMLElement;
      kingdomElement.setAttribute("class", "kingdom-viewer-group");
      document.body.appendChild(kingdomElement);
    });
    it("should return true", () => {
      expect(isKingdomElementPresent()).toBe(true);
    });
  });
  describe("without kingdom-view-group in DOM", () => {
    beforeAll(() => {
      document.body.removeChild(kingdomElement);
    });
    it("should return false", () => {
      expect(isKingdomElementPresent()).toBe(false);
    });
  });
});
