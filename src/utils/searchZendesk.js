async function searchZendesk (data, client, method) {


  if(method==0){

    let type = data.type;
    let init_date = data.init_date;
    let end_date = data.end_date;
  
    console.log("type", type);
    console.log("init_date", init_date);
    console.log("end_date", end_date);
  
    const url = `/api/v2/search.json?query=type:${type} created>${init_date} created<${end_date}`
    return await request(url, client).then(function(data) {
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


async function request (url, client) {
  console.log("Entre al request", url)
  let settings = {
    url,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json'
  }
  return await client.request(settings).then(async function(data) {
    console.log(results)
    let results = data.results
   if(data.next_page){
     console.log("Este es nextPage", data.next_page)
     let othervals= await request(data.next_page, client);
     results = results.concat(othervals)
   }
        return results
      
    
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
module.exports = searchZendesk

