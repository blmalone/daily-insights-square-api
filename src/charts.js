const createSalesChart = (totals, currentDay, readableDate, title) => {
  const ss = SpreadsheetApp.create(`Weekly Sales Chart - ${readableDate} ${title}`);
  const sheet = ss.getActiveSheet();

  sheet.appendRow(["Week", "Sales"]);
  totals.forEach((total, index) => {
    const pounds = total / 100;
    const label = index === totals.length - 1 ? "Now" : `Week ${index + 1}`;
    sheet.appendRow([label, pounds]);
  });

  sheet.getRange("B2:B" + (totals.length + 1)).setNumberFormat("£#,##0.00");

  const chart = sheet
    .newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(sheet.getRange("A2:B" + (totals.length + 1)))
    .setPosition(5, 5, 0, 0)
    .setOption("title", `${title} - ${currentDay} Weekly Sales`)
    .setOption("legend", { position: "bottom" })
    .setOption("curveType", "function")
    .setOption("vAxis", {
      title: "Sales (in Pounds)",
      format: "currency",
      gridlines: { count: -1 },
      viewWindow: { min: 0 },
      minorGridlines: { count: 4 },
    })
    .setOption("trendlines", {
      0: {
        type: "linear",
        color: "green",
        lineWidth: 2,
        opacity: 0.5,
        showR2: true,
        visibleInLegend: true,
      },
    })
    .build();
  sheet.insertChart(chart);

  const chartBlob = chart.getAs("image/png");
  return { chartBlob, spreadsheetId: ss.getId(), chartFileName: `${title}_weekly_sales_${readableDate}.png` };
};


const createPurchasesChart = (totals, currentDay, readableDate, title) => {
  const ss = SpreadsheetApp.create(`Weekly Purchases Chart - ${readableDate} ${title}`);
  const sheet = ss.getActiveSheet();

  sheet.appendRow(["Week", "Purchases"]);
  totals.forEach((total, index) => {
    const label = index === totals.length - 1 ? "Now" : `Week ${index + 1}`;
    sheet.appendRow([label, total]);
  });

  const chart = sheet
    .newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(sheet.getRange("A2:B" + (totals.length + 1)))
    .setPosition(5, 5, 0, 0)
    .setOption("title", `${title} - ${currentDay} Weekly Purchases`)
    .setOption("legend", { position: "bottom" })
    .setOption("curveType", "function")
    .setOption("vAxis", {
      title: "Number of Purchases Per Day",
      gridlines: { count: -1 },
      viewWindow: { min: 0 },
      minorGridlines: { count: 4 },
    })
    .setOption("trendlines", {
      0: {
        type: "linear",
        color: "green",
        lineWidth: 2,
        opacity: 0.5,
        showR2: true,
        visibleInLegend: true,
      },
    })
    .build();
  sheet.insertChart(chart);

  const chartBlob = chart.getAs("image/png");
  return { chartBlob, spreadsheetId: ss.getId(), chartFileName: `${title}_weekly_purchases_${readableDate}.png` };
};
