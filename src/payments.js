const retrievePayments = async (beginTime, endTime) => {
  let nextRequestCursor = EMPTY_STRING;
  let payments = [];
  do {
    const res = await getSquareTransactionData(beginTime, endTime, "DESC", nextRequestCursor);
    nextRequestCursor = res.cursor ? (nextRequestCursor = res.cursor) : EMPTY_STRING;
    if (res.payments && res.payments.length > 0) {
      payments.push(...res.payments);
    } else {
      console.log(`No payments found.`);
      return payments;
    }
  } while (nextRequestCursor !== EMPTY_STRING);
  return payments;
};

const getSquareTransactionData = (beginTime, endTime, sortOrder, cursor) => {
  const limit = 100;
  let url = `https://connect.squareup.com/v2/payments?location_id=${getSquareLocationId()}&begin_time=${beginTime}&end_time=${endTime}&sort_order=${sortOrder}&limit=${limit}`;

  if (cursor) {
    url += `&cursor=${cursor}`;
  }
  const headers = {
    Authorization: `Bearer ${getSquareAccessToken()}`,
    "Content-Type": "application/json",
  };

  const options = {
    method: "GET",
    headers: headers,
  };

  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
};

const totalPayments = (payments) => {
  let grossDailySpend = 0;
  let netDailySpend = 0;
  let totalRefunded = 0;
  let totalVoided = 0;

  if (!payments || payments.length === 0) {
    console.log("No payments yet for this period!");
  } else {
    for (let payment of payments) {
      if (payment.status === COMPLETED_PAYMENT) {
        const amount = toInt(payment.amount_money.amount);
        grossDailySpend += amount;

        if (payment.refunded_money) {
          netDailySpend -= toInt(payment.refunded_money.amount);
          totalRefunded += toInt(payment.refunded_money.amount);
        }
        if (payment.voided_money) {
          netDailySpend -= toInt(payment.voided_money.amount);
          totalVoided += toInt(payment.voided_money.amount);
        }
        netDailySpend += amount;
      } else {
        // console.log(`Payment found that wasn't completed. ${payment.id}`);
      }
    }
  }
  return { grossDailySpend, netDailySpend, totalRefunded, totalVoided };
};
