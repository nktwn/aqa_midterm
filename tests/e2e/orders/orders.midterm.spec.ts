import { test, expect } from "../../fixtures/test";
import { buildMockOrder, mockEcommerceApi } from "../../helpers/mock-backend";
import { seedAuthSession } from "../../helpers/session";
import { attachQaMetadata } from "../../helpers/test-metadata";

test.describe("Orders Midterm", () => {
  test("double cancellation leaves the order in a stable cancelled state @critical @regression @orders", async ({
    page,
  }) => {
    await attachQaMetadata(test.info(), {
      testId: "TC-ORDER-CONC-01",
      module: "Order lifecycle",
      scenarioType: "concurrency",
      inputData: "Authenticated customer rapidly double-clicks order cancellation for a pending order",
      expectedOutput: "Order ends in Cancelled state without duplicate rows or a broken detail page",
    });

    await seedAuthSession(page, "customer");
    await mockEcommerceApi(page, {
      authenticatedAs: "customer",
      initialOrders: [buildMockOrder(5001)],
      initialContracts: [],
    });

    await page.goto("/orders/5001");
    await page.getByRole("button", { name: /Отменить заказ/i }).dblclick();

    await expect(page.getByText("Cancelled")).toBeVisible();
    await expect(page.getByText("Заказ #5001")).toBeVisible();
  });
});
