function sendTicketsZendesk (sectionsTickets, client) {
  // sectionsTickets.forEach((arrayOneHundredTickets) => {
    // createBulkTickets(arrayOneHundredTickets, client)
    // })
    createBulkTickets(sectionsTickets, client)
}

async function createBulkTickets (arrayOneHundredTickets, client) {
  console.log("entro al createbulk ticket");
  const url = `/api/v2/tickets/create_many.json`
  let ticketData = {
    tickets: arrayOneHundredTickets
  }

  let settings = {
    url,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(ticketData)
  }
  console.log("jsn enviado", settings);

  console.log("llegue al bulk", settings);
  console.log("response",await client.request(settings));
}

module.exports = sendTicketsZendesk

