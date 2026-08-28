import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateSplitAmounts, calculateSettlements } from "../utils/splitCalculator.js";

describe("Expense Split Calculator & Settlement Algorithm Tests", () => {
  // Scenario 1: Equal split
  test("1. Equal split with single payer", () => {
    const res = calculateSplitAmounts({
      totalAmount: 800,
      splitType: "equal",
      payers: [{ name: "Sachin", amount: 800 }],
      participants: [
        { name: "Sachin" },
        { name: "Rohit" },
        { name: "Friend 3" },
        { name: "Friend 4" },
        { name: "Friend 5" },
      ],
    });

    assert.equal(res.isValid, true);
    assert.equal(res.participants.length, 5);
    res.participants.forEach((p) => {
      assert.equal(p.shareAmount, 160);
    });

    const sachin = res.participants.find((p) => p.name === "Sachin");
    assert.equal(sachin.paidAmount, 800);
    assert.equal(sachin.balance, 640);

    const rohit = res.participants.find((p) => p.name === "Rohit");
    assert.equal(rohit.balance, -160);
  });

  // Scenario 2: Multiple payers (prompt example!)
  test("2. Multiple payers equal split (Prompt Example)", () => {
    const res = calculateSplitAmounts({
      totalAmount: 800,
      splitType: "equal",
      payers: [
        { name: "Sachin", amount: 500 },
        { name: "Rohit", amount: 300 },
      ],
      participants: [
        { name: "Sachin" },
        { name: "Rohit" },
        { name: "Friend 3" },
        { name: "Friend 4" },
        { name: "Friend 5" },
      ],
    });

    assert.equal(res.isValid, true);
    const sachin = res.participants.find((p) => p.name === "Sachin");
    const rohit = res.participants.find((p) => p.name === "Rohit");
    const f3 = res.participants.find((p) => p.name === "Friend 3");
    const f4 = res.participants.find((p) => p.name === "Friend 4");
    const f5 = res.participants.find((p) => p.name === "Friend 5");

    assert.equal(sachin.paidAmount, 500);
    assert.equal(sachin.shareAmount, 160);
    assert.equal(sachin.balance, 340);

    assert.equal(rohit.paidAmount, 300);
    assert.equal(rohit.shareAmount, 160);
    assert.equal(rohit.balance, 140);

    assert.equal(f3.balance, -160);
    assert.equal(f4.balance, -160);
    assert.equal(f5.balance, -160);

    // Verify Settlements algorithm minimizes transactions correctly
    const settlements = calculateSettlements(res.participants);
    assert.equal(settlements.length, 4);

    // Sum of settlements must equal total debt (480)
    const totalSettled = settlements.reduce((s, x) => s + x.amount, 0);
    assert.equal(totalSettled, 480);
  });

  // Scenario 3: Unequal custom split
  test("3. Custom / Unequal split", () => {
    const res = calculateSplitAmounts({
      totalAmount: 1000,
      splitType: "unequal",
      payers: [{ name: "Alice", amount: 1000 }],
      participants: [
        { name: "Alice", shareAmount: 500 },
        { name: "Bob", shareAmount: 300 },
        { name: "Charlie", shareAmount: 200 },
      ],
    });

    assert.equal(res.isValid, true);
    assert.equal(res.participants[0].balance, 500); // 1000 - 500
    assert.equal(res.participants[1].balance, -300); // 0 - 300
    assert.equal(res.participants[2].balance, -200); // 0 - 200

    const settlements = calculateSettlements(res.participants);
    assert.equal(settlements.length, 2);
  });

  // Scenario 4: Percentage split
  test("4. Percentage split", () => {
    const res = calculateSplitAmounts({
      totalAmount: 500,
      splitType: "percentage",
      payers: [{ name: "Alice", amount: 500 }],
      participants: [
        { name: "Alice", percentage: 50 },
        { name: "Bob", percentage: 30 },
        { name: "Charlie", percentage: 20 },
      ],
    });

    assert.equal(res.isValid, true);
    assert.equal(res.participants[0].shareAmount, 250);
    assert.equal(res.participants[1].shareAmount, 150);
    assert.equal(res.participants[2].shareAmount, 100);
  });

  // Scenario 5: Shares split
  test("5. Shares split", () => {
    const res = calculateSplitAmounts({
      totalAmount: 400,
      splitType: "shares",
      payers: [{ name: "Alice", amount: 400 }],
      participants: [
        { name: "Alice", shares: 2 },
        { name: "Bob", shares: 1 },
        { name: "Charlie", shares: 1 },
      ],
    });

    assert.equal(res.isValid, true);
    assert.equal(res.participants[0].shareAmount, 200);
    assert.equal(res.participants[1].shareAmount, 100);
    assert.equal(res.participants[2].shareAmount, 100);
  });

  // Scenario 6: Rounding precision handling
  test("6. Rounding handling for non-divisible equal amounts (100 / 3)", () => {
    const res = calculateSplitAmounts({
      totalAmount: 100,
      splitType: "equal",
      payers: [{ name: "Alice", amount: 100 }],
      participants: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
    });

    assert.equal(res.isValid, true);
    const sumShares = res.participants.reduce((s, p) => s + p.shareAmount, 0);
    assert.equal(sumShares, 100);
  });

  // Scenario 7: Multiple creditors and debtors
  test("7. Complex settlement with multiple creditors and debtors", () => {
    const participants = [
      { name: "A", balance: 500 },
      { name: "B", balance: 300 },
      { name: "C", balance: -400 },
      { name: "D", balance: -200 },
      { name: "E", balance: -200 },
    ];

    const settlements = calculateSettlements(participants);
    assert.ok(settlements.length <= 4); // Max transactions required should be <= 4

    // Verify all creditor balances are cleared by settlements
    const received = {};
    settlements.forEach((s) => {
      received[s.toName] = (received[s.toName] || 0) + s.amount;
    });

    assert.equal(received["A"], 500);
    assert.equal(received["B"], 300);
  });

  // Scenario 8: No settlement required
  test("8. No settlement required (everyone paid exact share)", () => {
    const res = calculateSplitAmounts({
      totalAmount: 300,
      splitType: "equal",
      payers: [
        { name: "Alice", amount: 100 },
        { name: "Bob", amount: 100 },
        { name: "Charlie", amount: 100 },
      ],
      participants: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
    });

    assert.equal(res.isValid, true);
    res.participants.forEach((p) => {
      assert.equal(p.balance, 0);
    });

    const settlements = calculateSettlements(res.participants);
    assert.equal(settlements.length, 0);
  });

  // Scenario 9: Impossible / invalid split error validation
  test("9. Invalid inputs trigger validation errors", () => {
    // 9a. Total paid doesn't equal total expense
    const res1 = calculateSplitAmounts({
      totalAmount: 1000,
      splitType: "equal",
      payers: [{ name: "Alice", amount: 800 }],
      participants: [{ name: "Alice" }, { name: "Bob" }],
    });
    assert.equal(res1.isValid, false);
    assert.ok(res1.errors.some((e) => e.includes("Total paid amount")));

    // 9b. Percentages != 100%
    const res2 = calculateSplitAmounts({
      totalAmount: 500,
      splitType: "percentage",
      payers: [{ name: "Alice", amount: 500 }],
      participants: [
        { name: "Alice", percentage: 50 },
        { name: "Bob", percentage: 40 },
      ],
    });
    assert.equal(res2.isValid, false);
    assert.ok(res2.errors.some((e) => e.includes("100%")));

    // 9c. Unequal sum != total
    const res3 = calculateSplitAmounts({
      totalAmount: 500,
      splitType: "unequal",
      payers: [{ name: "Alice", amount: 500 }],
      participants: [
        { name: "Alice", shareAmount: 200 },
        { name: "Bob", shareAmount: 200 },
      ],
    });
    assert.equal(res3.isValid, false);
    assert.ok(res3.errors.some((e) => e.includes("must equal total")));
  });
});
