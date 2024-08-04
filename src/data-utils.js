const getFirstDayOfTheWeek = (dayOfTheWeek) => {
  const openingDate = getCafeOpeningDate();
  let result = { startOfDay: null, endOfDay: null, date: null };
  switch (dayOfTheWeek) {
    case DAYS_OF_WEEK.SUNDAY:
      result.date = openingDate.date.setDate(openingDate.date.getDate() + 5);
      break;
    case DAYS_OF_WEEK.MONDAY:
      result.date = openingDate.date.setDate(openingDate.date.getDate() + 6);
      break;
    case DAYS_OF_WEEK.TUESDAY:
      result.date = openingDate.date.setDate(openingDate.date.getDate() + 0);
      break;
    case DAYS_OF_WEEK.WEDNESDAY:
      result.date = openingDate.date.setDate(openingDate.date.getDate() + 1);
      break;
    case DAYS_OF_WEEK.THURSDAY:
      result.date = openingDate.date.setDate(openingDate.date.getDate() + 2);
      break;
    case DAYS_OF_WEEK.FRIDAY:
      result.date = openingDate.date.setDate(openingDate.date.getDate() + 3);
      break;
    case DAYS_OF_WEEK.SATURDAY:
      result.date = openingDate.date.setDate(openingDate.date.getDate() + 4);
      break;
    default:
      throw new Error("Invalid day of the week!");
  }
  const startAndEndTimes = resetDateForStartAndEndTimes(result.date);
  result.startOfDay = startAndEndTimes.startOfDay;
  result.endOfDay = startAndEndTimes.endOfDay;
  return result;
};

const getCafeOpeningDate = () => {
  const start = new Date();
  start.setUTCFullYear(2023);
  start.setUTCMonth(6); // indexed from 0 - 6 is july
  start.setUTCDate(11);
  start.setUTCHours(0, 0, 0, 0);
  let startOfDay = start.toISOString();

  const end = new Date();
  end.setUTCFullYear(2023);
  end.setUTCMonth(6); // indexed from 0
  end.setUTCDate(11);
  end.setUTCHours(23, 59, 59, 999);
  let endOfDay = end.toISOString();

  return { startOfDay, endOfDay, date: start };
};

const resetDateForStartAndEndTimes = (date) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  let startOfDay = start.toISOString();

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  let endOfDay = end.toISOString();

  return { startOfDay, endOfDay };
};

const getDateMetadata = (date) => {
  const { startOfDay, endOfDay } = resetDateForStartAndEndTimes(date);
  return { startOfDay, endOfDay, date };
};
