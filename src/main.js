const calculateDailyInsight = async () => {
  let shouldSendEmail = false;
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const today = getDateMetadata(currentDate);
  const readableDate = `${month} ${day}, ${year}`;
  const currentDay = DAYS_OF_WEEK_ARRAY[currentDate.getDay()];

  const startFromDate = getFirstDayOfTheWeek(currentDay);
  console.log(`Totalling income starting from: ${JSON.stringify(startFromDate)}`);

  let currentDayToProcess = JSON.parse(JSON.stringify(startFromDate));
  let numberOfPurchasesPerDay = [];
  let total = 0;
  let weeks = 0;
  let totals = [];
  let todaysTotal = 0;
  let todaysPurchases = 0;

  const retrievePaymentsPromises = [];

  do {
    weeks++;
    retrievePaymentsPromises.push(retrievePayments(currentDayToProcess.startOfDay, currentDayToProcess.endOfDay));
    const oneWeekFromCurrentDate = new Date(currentDayToProcess.date);
    oneWeekFromCurrentDate.setDate(oneWeekFromCurrentDate.getDate() + 7);
    currentDayToProcess = getDateMetadata(oneWeekFromCurrentDate);
  } while (currentDayToProcess.date <= currentDate);

  const paymentsResults = await Promise.all(retrievePaymentsPromises);

  paymentsResults.forEach((payments, index) => {
    const numberOfPayments = payments.length || 0;
    numberOfPurchasesPerDay.push(numberOfPayments);

    if (index === paymentsResults.length - 1) {
      todaysPurchases = numberOfPayments;
    }

    const totalPaymentsResult = totalPayments(payments);
    total += totalPaymentsResult.netDailySpend;
    todaysTotal = totalPaymentsResult.netDailySpend;
    totals.push(totalPaymentsResult.netDailySpend);
  });

  const oldAverageIncomePerDay = totals.slice(0, -1).reduce((acc, curr) => acc + curr, 0) / (weeks - 1);
  const newAverageIncomePerDay = total / weeks;

  const totalNumberOfPurchases = numberOfPurchasesPerDay.reduce((acc, curr) => acc + curr, 0);
  const oldAveragePurchasesPerDay = numberOfPurchasesPerDay.slice(0, -1).reduce((acc, curr) => acc + curr, 0) / (weeks - 1);
  const newAveragePurchasesPerDay = totalNumberOfPurchases / weeks;

  const nextDayToProcess = currentDayToProcess.date.toISOString();
  console.log(`Todays total: ${convertToPoundsString(todaysTotal)}`);
  console.log(`Next ${currentDay} not yet processed: ${nextDayToProcess}`);
  console.log(`Total across all ${currentDay}'s: ${convertToPoundsString(total)}`);
  console.log(`Old average income per ${currentDay}: ${convertToPoundsString(oldAverageIncomePerDay)}`);
  console.log(`Average income per ${currentDay}: ${convertToPoundsString(newAverageIncomePerDay)}`);
  console.log(`Historical sales on ${currentDay}'s: ${totals}`);

  const totalsLatestFirst = [...totals].reverse();

  const movingAvgPromises = [
    createMovingAvgData(2, totalsLatestFirst, todaysTotal, currentDay, readableDate),
    createMovingAvgData(4, totalsLatestFirst, todaysTotal, currentDay, readableDate),
    createMovingAvgData(6, totalsLatestFirst, todaysTotal, currentDay, readableDate),
    createMovingAvgData(8, totalsLatestFirst, todaysTotal, currentDay, readableDate),
    createMovingAvgData(10, totalsLatestFirst, todaysTotal, currentDay, readableDate),
    createMovingAvgData(12, totalsLatestFirst, todaysTotal, currentDay, readableDate),
    createMovingAvgData(14, totalsLatestFirst, todaysTotal, currentDay, readableDate),
    createMovingAvgData(16, totalsLatestFirst, todaysTotal, currentDay, readableDate),
    createMovingAvgData(18, totalsLatestFirst, todaysTotal, currentDay, readableDate),
    createMovingAvgData(20, totalsLatestFirst, todaysTotal, currentDay, readableDate),
  ];

  const movingAvgDataResults = await Promise.all(movingAvgPromises);

  const percentageChangeSinceGenesis = calculatePercentageChange(todaysTotal, oldAverageIncomePerDay);
  const percentageChangeMessage = formatPercentageChangeMessage(todaysTotal, oldAverageIncomePerDay, percentageChangeSinceGenesis, "average");

  const lastWeeksTotal = totals[totals.length - 2];
  const percentageChangeOnLastWeek = calculatePercentageChange(todaysTotal, lastWeeksTotal);
  const lastWeeksPercentageChangeMessage = formatPercentageChangeMessage(
    todaysTotal,
    lastWeeksTotal,
    percentageChangeOnLastWeek,
    `last ${currentDay}`,
  );

  const numberOfPaymentsPercentageChange = calculatePercentageChange(todaysPurchases, oldAveragePurchasesPerDay).toFixed(2);

  console.log(`Getting labor data for: ${today.startOfDay}`);
  const laborInfo = await getLaborInformation(today.startOfDay, today.endOfDay, todaysTotal);

  if (total > 0) shouldSendEmail = true;

  if (shouldSendEmail) {
    const subject = `💰 Daily Insight Report V3 - ${readableDate}`;
    const emails = getUserEmails();
    const recipients = [emails.USER_EMAIL_1, emails.USER_EMAIL_2];
    let body = `<h1>Daily Sales Insights </h1><p>Comparing todays sales with historical sales from all ${currentDay}'s.</p>`;
    body +=
      `<b>${currentDay} - ${readableDate}</b>` +
      `<ul>Todays total: ${convertToPoundsString(todaysTotal)}</ul>` +
      `<ul>Number of purchases today: ${todaysPurchases}</ul>` +
      `<ul>Old average number of purchases per ${currentDay}: ${oldAveragePurchasesPerDay.toFixed(2)}</ul>` +
      `<ul>New average number of purchases per ${currentDay}: ${newAveragePurchasesPerDay.toFixed(2)}</ul>` +
      `<ul>Percentage change in number of purchases per ${currentDay}: ${numberOfPaymentsPercentageChange}%</ul>` +
      `<ul>Previous Average per ${currentDay}: ${convertToPoundsString(oldAverageIncomePerDay)}</ul>` +
      `<ul>New Average per ${currentDay}: ${convertToPoundsString(newAverageIncomePerDay)}</ul>` +
      `<ul>${percentageChangeMessage}</ul>` +
      `<ul>${lastWeeksPercentageChangeMessage}</ul>` +
      laborInfo.laborCostMessage +
      laborInfo.staffWorkingMessage +
      `<ul><b>Moving Average Performances</b>` +
      movingAvgDataResults.map((data, index) => `<ul>${data.message}</ul><img src="cid:${index + 1}_week_sales_chart" alt="${index + 1} Week Trend"/>`).join('') +
      `</ul>`;

    const allChartInfo = createSalesChart(totals, currentDay, readableDate, "All");

    body += `<h2>Weekly Sales Chart</h2><img src="cid:sales_chart" alt="Weekly Sales Chart"/>`;

    console.log(body);

    MailApp.sendEmail({
      to: recipients.join(","),
      subject: subject,
      htmlBody: body,
      inlineImages: {
        sales_chart: allChartInfo.chartBlob.setName(allChartInfo.chartFileName),
        ...movingAvgDataResults.reduce((acc, data, index) => {
          acc[`${index + 1}_week_sales_chart`] = data.chartInfo.chartBlob.setName(data.chartInfo.chartFileName);
          return acc;
        }, {})
      },
    });

    const chartIds = [allChartInfo.spreadsheetId, ...movingAvgDataResults.map(data => data.chartInfo.spreadsheetId)];
    chartIds.forEach(id => DriveApp.getFileById(id).setTrashed(true));
  } else {
    console.log("Couldn't send email!");
  }
};

const createMovingAvgData = (weeks, totalsLatestFirst, todaysTotal, currentDay, readableDate) => {
  const { movingAverage, totals } = calculateMovingAverage(weeks, totalsLatestFirst);
  const message = formatPercentageChangeMessage(
    todaysTotal,
    movingAverage,
    calculatePercentageChange(todaysTotal, movingAverage),
    `the ${weeks} week moving average`,
  );
  const totalsEarliestFirst = [...totals].reverse();
  const chartInfo = createSalesChart(totalsEarliestFirst, currentDay, readableDate, `${weeks} week trend`);
  return { message, chartInfo };
};