/**
 * Financial Calculation & Settlement Algorithm Engine
 */

/**
 * Rounds monetary value to 2 decimal places to prevent floating point issues.
 */
const roundCurrency = (val) => Math.round(val * 100) / 100;

/**
 * Calculates share amounts, participant balances, and validates input for split expenses.
 *
 * @param {Object} params
 * @param {number} params.totalAmount Total expense amount
 * @param {string} params.splitType 'equal' | 'unequal' | 'percentage' | 'shares'
 * @param {Array} params.payers Array of { user, name, email, amount }
 * @param {Array} params.participants Array of { user, name, email, shareAmount, percentage, shares }
 * @returns {Object} { participants, payers, isValid, errors }
 */
export const calculateSplitAmounts = ({ totalAmount, splitType, payers, participants }) => {
  const errors = [];

  const parsedTotal = roundCurrency(Number(totalAmount));
  if (isNaN(parsedTotal) || parsedTotal <= 0) {
    errors.push("Total amount must be a positive number");
    return { isValid: false, errors };
  }

  if (!Array.isArray(payers) || payers.length === 0) {
    errors.push("At least one payer is required");
    return { isValid: false, errors };
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    errors.push("At least one participant is required");
    return { isValid: false, errors };
  }

  // Validate total paid amount
  let totalPaid = 0;
  const cleanedPayers = payers.map((p) => {
    const amt = roundCurrency(Number(p.amount || 0));
    totalPaid = roundCurrency(totalPaid + amt);
    return {
      user: p.user || null,
      name: p.name ? p.name.trim() : "Unknown",
      email: p.email ? p.email.trim() : "",
      amount: amt,
    };
  });

  if (Math.abs(totalPaid - parsedTotal) > 0.01) {
    errors.push(`Total paid amount (${totalPaid}) does not equal total expense amount (${parsedTotal})`);
  }

  const count = participants.length;
  let calculatedParticipants = [];

  // Determine shareAmount for each participant based on splitType
  if (splitType === "equal") {
    const baseShare = Math.floor((parsedTotal * 100) / count) / 100;
    let remainderCents = Math.round(parsedTotal * 100 - baseShare * 100 * count);

    calculatedParticipants = participants.map((part) => {
      let share = baseShare;
      if (remainderCents > 0) {
        share = roundCurrency(share + 0.01);
        remainderCents -= 1;
      }
      return {
        user: part.user || null,
        name: part.name ? part.name.trim() : "Unknown",
        email: part.email ? part.email.trim() : "",
        shareAmount: share,
        percentage: roundCurrency(100 / count),
        shares: 1,
      };
    });
  } else if (splitType === "unequal") {
    let sumShares = 0;
    calculatedParticipants = participants.map((part) => {
      const share = roundCurrency(Number(part.shareAmount || 0));
      if (share < 0) {
        errors.push(`Invalid custom share amount for ${part.name}`);
      }
      sumShares = roundCurrency(sumShares + share);
      return {
        user: part.user || null,
        name: part.name ? part.name.trim() : "Unknown",
        email: part.email ? part.email.trim() : "",
        shareAmount: share,
        percentage: parsedTotal > 0 ? roundCurrency((share / parsedTotal) * 100) : 0,
        shares: 0,
      };
    });

    if (Math.abs(sumShares - parsedTotal) > 0.01) {
      errors.push(`Sum of custom split amounts (${sumShares}) must equal total expense (${parsedTotal})`);
    }
  } else if (splitType === "percentage") {
    let totalPct = 0;
    participants.forEach((part) => {
      totalPct = roundCurrency(totalPct + Number(part.percentage || 0));
    });

    if (Math.abs(totalPct - 100) > 0.05) {
      errors.push(`Total percentage split (${totalPct}%) must equal 100%`);
    }

    let allocatedShareSum = 0;
    calculatedParticipants = participants.map((part, index) => {
      const pct = Number(part.percentage || 0);
      let share = Math.floor(((parsedTotal * pct) / 100) * 100) / 100;
      if (index === participants.length - 1) {
        // Assign residual cents to the last participant
        share = roundCurrency(parsedTotal - allocatedShareSum);
      } else {
        allocatedShareSum = roundCurrency(allocatedShareSum + share);
      }
      return {
        user: part.user || null,
        name: part.name ? part.name.trim() : "Unknown",
        email: part.email ? part.email.trim() : "",
        shareAmount: share,
        percentage: pct,
        shares: 0,
      };
    });
  } else if (splitType === "shares") {
    let totalShares = 0;
    participants.forEach((part) => {
      const sh = Number(part.shares || 0);
      if (sh <= 0) {
        errors.push(`Shares for ${part.name} must be greater than 0`);
      }
      totalShares += sh;
    });

    if (totalShares <= 0) {
      errors.push("Total shares must be greater than 0");
    }

    let allocatedShareSum = 0;
    calculatedParticipants = participants.map((part, index) => {
      const sh = Number(part.shares || 0);
      let share = totalShares > 0 ? Math.floor(((parsedTotal * sh) / totalShares) * 100) / 100 : 0;
      if (index === participants.length - 1) {
        share = roundCurrency(parsedTotal - allocatedShareSum);
      } else {
        allocatedShareSum = roundCurrency(allocatedShareSum + share);
      }
      return {
        user: part.user || null,
        name: part.name ? part.name.trim() : "Unknown",
        email: part.email ? part.email.trim() : "",
        shareAmount: share,
        percentage: totalShares > 0 ? roundCurrency((sh / totalShares) * 100) : 0,
        shares: sh,
      };
    });
  } else {
    errors.push(`Invalid split type: ${splitType}`);
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Map total paid amounts per participant
  calculatedParticipants = calculatedParticipants.map((part) => {
    let paidAmount = 0;
    cleanedPayers.forEach((payer) => {
      const isUserMatch = payer.user && part.user && payer.user.toString() === part.user.toString();
      const isNameMatch = payer.name && part.name && payer.name.toLowerCase().trim() === part.name.toLowerCase().trim();
      if (isUserMatch || isNameMatch) {
        paidAmount = roundCurrency(paidAmount + payer.amount);
      }
    });

    const balance = roundCurrency(paidAmount - part.shareAmount);
    return {
      ...part,
      paidAmount,
      balance,
    };
  });

  return {
    isValid: true,
    totalAmount: parsedTotal,
    payers: cleanedPayers,
    participants: calculatedParticipants,
    errors: [],
  };
};

/**
 * Calculates minimum required settlement transactions using Greedy Min-Flow algorithm.
 *
 * @param {Array} participants Array of { user, name, balance }
 * @returns {Array} List of settlement objects { fromUser, fromName, toUser, toName, amount, status: 'Pending' }
 */
export const calculateSettlements = (participants) => {
  if (!Array.isArray(participants) || participants.length === 0) {
    return [];
  }

  // Create deep copy working objects
  const debtors = [];
  const creditors = [];

  participants.forEach((p) => {
    const bal = roundCurrency(p.balance || 0);
    if (bal < -0.005) {
      debtors.push({
        user: p.user || null,
        name: p.name || "Unknown",
        balance: Math.abs(bal), // positive debt amount
      });
    } else if (bal > 0.005) {
      creditors.push({
        user: p.user || null,
        name: p.name || "Unknown",
        balance: bal, // positive credit amount
      });
    }
  });

  // Sort debtors & creditors by largest balance first
  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  const settlements = [];

  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    const amount = roundCurrency(Math.min(debtor.balance, creditor.balance));

    if (amount > 0) {
      settlements.push({
        fromUser: debtor.user,
        fromName: debtor.name,
        toUser: creditor.user,
        toName: creditor.name,
        amount,
        status: "Pending",
      });

      debtor.balance = roundCurrency(debtor.balance - amount);
      creditor.balance = roundCurrency(creditor.balance - amount);
    }

    if (debtor.balance < 0.005) {
      d++;
    }
    if (creditor.balance < 0.005) {
      c++;
    }
  }

  return settlements;
};
