const calculatePercentageChange = (current, previous) => ((current - previous) / previous) * 100;

const formatSalesPercentageChangeMessage = (current, previous, percentageChange, comparisonText) => {
  const sameMessage = `Sales today were the same as ${comparisonText}!`;
  const moreMessage = `Great, sales today were ${percentageChange.toFixed(2)}% more than ${comparisonText}! 🎉`;
  const lessMessage = `Sales today were ${percentageChange.toFixed(2)}% less than ${comparisonText}. 🫤`;

  if (previous <= current) {
    return previous === current ? sameMessage : moreMessage;
  } else {
    return lessMessage;
  }
};

const formatPurchasesPercentageChangeMessage = (current, previous, percentageChange, comparisonText) => {
  const sameMessage = `Purchases today were the same as ${comparisonText}!`;
  const moreMessage = `Great, number of purchases today were ${percentageChange.toFixed(2)}% more than ${comparisonText}! 🎉`;
  const lessMessage = `Number of purchases today were ${percentageChange.toFixed(2)}% less than ${comparisonText}. 🫤`;

  if (previous <= current) {
    return previous === current ? sameMessage : moreMessage;
  } else {
    return lessMessage;
  }
};

const calculateMovingAverage = (numberOfWeeks, totalsLatestFirst) => {
  if (totalsLatestFirst.length <= numberOfWeeks) {
    throw new Error("Not enough data to calculate the moving average after skipping the most recent week.");
  }

  const totalsExcludingCurrentDay = totalsLatestFirst.slice(1, numberOfWeeks + 1);
  const totalsIncludingCurrentDay = totalsLatestFirst.slice(0, numberOfWeeks + 1);
  const sum = totalsExcludingCurrentDay.reduce((acc, curr) => acc + curr, 0);
  const movingAverage = sum / numberOfWeeks;

  return { movingAverage, totals: totalsIncludingCurrentDay };
};

const convertToPoundsString = (bigIntNum) => {
  if (!bigIntNum) return ZERO.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
  const totalSalesPennies = parseInt(bigIntNum.toString());
  const totalSalesPounds = (totalSalesPennies / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP" });
  return totalSalesPounds;
};

const toInt = (bigint) => {
  return parseInt(bigint.toString());
};

