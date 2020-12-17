async function searchZendesk (data, client, method) {


  if(method==0){
    return await searchData(data, client).then(function(data) {
      console.log(data);
      return data;
    });
  }



  if(method == 1){
    return await searchUserbyExternalId(data, client).then(function(data) {
      console.log(data);
      return data;
    });
  }else if(method == 2){
    return await searchUserbyExternalId(data, client).then(function(data) {
      console.log(data);
      return data;
    });
  }
}


async function searchData (data, client) {
  let type = data.type;
  let init_date = data.init_date;
  let end_date = data.end_date;

  console.log("type", type);
  console.log("init_date", init_date);
  console.log("end_date", end_date);

  const url = `/api/v2/search.json?query=type:${type} created>2020-11-17 created<2020-11-25`
  let settings = {
    url,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json'
  }


  return client.request(settings).then(function(data) {
 
        return data.results
      
    
  });

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
async function searcGroup (id, client) {
  const url = `/api/v2/groups.json`

  let settings = {
    url,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json'
  }


  return client.request(settings).then(function(data) {
   
    console.log(data)
  });

}


module.exports = searchZendesk

