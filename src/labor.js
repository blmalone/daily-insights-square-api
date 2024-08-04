const getLaborInformation = async (startOfDay, endOfDay, netDailySpend) => {
  let totalLaborCost = 0;
  let laborCostMessage = "<p>Labor percentage of actual income: ";
  let staffWorkingMessage = "";
  const shifts = [];
  const todaysShifts = await getSquareShiftData(startOfDay, endOfDay);

  if (!todaysShifts || !todaysShifts.shifts) {
    let noShiftMessage = "No shifts found - staff forgot to clock in.";
    console.log(noShiftMessage);
    laborCostMessage += noShiftMessage;
  } else {
    for (let shift of todaysShifts.shifts) {
      const teamMember = await getTeamMemberByID(shift.employee_id);
      const firstName = teamMember.team_member.given_name;
      const lastName = teamMember.team_member.family_name;
      console.log(teamMember);
      console.log(shift);
      let clockedInAt = new Date(shift.start_at);
      let clockedOutAt = new Date(shift.end_at);
      const hoursWorked = ((clockedOutAt.getTime() - clockedInAt.getTime()) / (1000 * 60 * 60)).toFixed(2);
      const hourlyRate = shift.wage.hourly_rate.amount / 100;
      const totalPay = Number(hoursWorked) * hourlyRate;
      const laborCost = Number(totalPay.toFixed(2));
      shifts.push({
        fullName: `${firstName} ${lastName}`,
        totalPay: laborCost,
      });
      totalLaborCost += laborCost;
    }

    const netSales = netDailySpend / 100;
    const laborPercentageofNetSales = ((totalLaborCost / netSales) * 100).toFixed(2);
    laborCostMessage += `${laborPercentageofNetSales}%`;

    if (laborPercentageofNetSales < LABOR_THRESHOLD_PERCENT) {
      laborCostMessage += "🥳</p>";
    } else {
      laborCostMessage += "💀</p>";
    }
    laborCostMessage += `<p>Total labor cost: ~£${totalLaborCost}</p>`;

    for (let shift of shifts) {
      staffWorkingMessage += `<ul>Name: ${shift.fullName} - Wage: £${shift.totalPay}</ul>`;
    }
  }
  return { laborCostMessage, staffWorkingMessage };
};

const getSquareShiftData = async (beginTime, endTime) => {
  const url = `https://connect.squareup.com/v2/labor/shifts/search`;
  let body = {
    limit: 100,
    query: {
      filter: {
        end: {
          end_at: endTime,
          start_at: beginTime,
        },
      },
    },
  };

  const headers = {
    Authorization: `Bearer ${getSquareAccessToken()}`,
    "Content-Type": "application/json",
  };

  const options = {
    method: "POST",
    headers: headers,
    payload: JSON.stringify(body),
  };

  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
};

const getTeamMemberByID = async (teamMemberID) => {
  const url = `https://connect.squareup.com/v2/team-members/${teamMemberID}`;
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
