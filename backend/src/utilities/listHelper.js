
//Just some utility to help get strings
const getLobby = (id,list) => {
   for(let i =0; i<this.list.length;i++)
   { 
    if(list[i].id === id)
    {
      return list[i];
    }
    //Error handling
    else
    {
      return 0;
      console.log("ERROR: Tried to find non-existent lobby");
    }
   }
}


const removeLobby = (id,list) => {
  for(let i =0; i<this.lobbyList.length;i++)
  {
    if(lobbyList[i].id === id)
    {
      lobbyList.splice(i, 1);
    }
    else
    {
      console.log("ERROR: ID DOES NOT EXIST")
    }
  }
}
