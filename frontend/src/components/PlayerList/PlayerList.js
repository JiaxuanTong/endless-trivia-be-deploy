import React from "react";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const PlayersInLobby = (props) => {
  return (
    <TableContainer style={ {
        borderRadius: "20px",
        minHeight: "430px"
      } 
    }>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">Player Name</TableCell>
            <TableCell align="center">State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.userList.map((user) => (
            <TableRow key={user.name}>
              <TableCell style={ {width: "65%",
                  border: "none",
                  padding: "20px"
                } 
              } component="th" scope="row" align="center">{user.name}</TableCell>
              <TableCell style={ {width: "35%",
                  border: "none",
                  padding: "20px"
                } 
              } align="center">{user.ready ? "Ready" : "Not ready"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(PlayersInLobby);
