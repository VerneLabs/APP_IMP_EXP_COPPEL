function sendOrganizationsZendesk (sectionsTickets, client) {
  // sectionsTickets.forEach((arrayOneHundredTickets) => {
    // createBulkTickets(arrayOneHundredTickets, client)
    // })

    console.log("Este es el valor de lan data a enviar", sectionsTickets);
    createBulkOrganizations(sectionsTickets, client)
}

async function createBulkOrganizations(arrayOneHundredTickets, client) {
  console.log("entro al createbulk ticket");
  const url = `/api/v2/organizations/create_many.json`
  let orgData = {
    organizations: arrayOneHundredTickets
  }

  let settings = {
    url,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(orgData)
  }
  console.log("jsn enviado", settings);

  console.log("llegue al bulk", settings);
  console.log("response",await client.request(settings));
}

module.exports = sendOrganizationsZendesk

