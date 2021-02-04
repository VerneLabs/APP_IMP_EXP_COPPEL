async function userDataZendesk (id, client, method) {

  if(method == 1){
    return await searchUserbyExternalId(id, client).then(function(data) {
      console.log(data);
      return data;
    });
  }else if(method == 2){
    return await searchUserbyExternalId(id, client).then(function(data) {
      console.log(data);
      return data;
    });
  }
}

async function searchUserbyExternalId (id, client) {
  const url = `/api/v2/users/show_many.json?external_ids=${id}`

  let settings = {
    url,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json'
  }


  return client.request(settings).then(function(data) {
    if(data.users){
      if(data.users.length == 1){
        return data.users[0].id
      }
    }
  });

}

module.exports = userDataZendesk

