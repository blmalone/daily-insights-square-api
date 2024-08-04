const DAYS_OF_WEEK_ARRAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_OF_WEEK = {
  SUNDAY: DAYS_OF_WEEK_ARRAY[0],
  MONDAY: DAYS_OF_WEEK_ARRAY[1],
  TUESDAY: DAYS_OF_WEEK_ARRAY[2],
  WEDNESDAY: DAYS_OF_WEEK_ARRAY[3],
  THURSDAY: DAYS_OF_WEEK_ARRAY[4],
  FRIDAY: DAYS_OF_WEEK_ARRAY[5],
  SATURDAY: DAYS_OF_WEEK_ARRAY[6],
};
const EMPTY_STRING = "";

let SQUARE_ACCESS_TOKEN = "";
let SQUARE_LOCATION_ID = "";
let USER_EMAIL_1 = "";
let USER_EMAIL_2 = "";
let USER_EMAIL_3 = "";

const getSquareAccessToken = () => {
  if (SQUARE_ACCESS_TOKEN) return SQUARE_ACCESS_TOKEN;
  const scriptProperties = PropertiesService.getScriptProperties();
  SQUARE_ACCESS_TOKEN = scriptProperties.getProperty('SQUARE_ACCESS_TOKEN');
  return SQUARE_ACCESS_TOKEN;
}

const getSquareLocationId = () => {
  if (SQUARE_LOCATION_ID) return SQUARE_LOCATION_ID;
  const scriptProperties = PropertiesService.getScriptProperties();
  SQUARE_LOCATION_ID = scriptProperties.getProperty('SQUARE_LOCATION_ID');
  return SQUARE_LOCATION_ID;
};

const ZERO = 0;
const COMPLETED_PAYMENT = "COMPLETED";
const LABOR_THRESHOLD_PERCENT = 30;

const getUserEmails = () => {
  if (USER_EMAIL_1 && USER_EMAIL_2 && USER_EMAIL_3) {
    return { USER_EMAIL_1, USER_EMAIL_2, USER_EMAIL_3 };
  }
  const scriptProperties = PropertiesService.getScriptProperties();
  USER_EMAIL_1 = scriptProperties.getProperty('USER_EMAIL_1');
  USER_EMAIL_2 = scriptProperties.getProperty('USER_EMAIL_2');
  USER_EMAIL_3 = scriptProperties.getProperty('USER_EMAIL_3');
  return { USER_EMAIL_1, USER_EMAIL_2, USER_EMAIL_3 };
};
