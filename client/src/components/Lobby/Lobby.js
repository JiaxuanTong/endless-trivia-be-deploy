import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

// const useStyles = makeStyles({
//   "@global": {
//     ".MuiTableCell-head": {
//       fontSize: "medium",
//       fontWeight: "bold",
//       backgroundColor: "#FFB579",
//       color: "white",
//       '@media (min-width: 780px)': {
//         fontSize: "small",
//       },
//     },
//     ".MuiTableCell-stickyHeader": {
//       zIndex: "0",
//     },
//     ".MuiTable-root": {
//       height: "100%",
//     },
//   },
// });

const StyledButton = withStyles({
  root: {
    border: "1px solid",
    borderColor: "black",
    borderRadius: 3,
    color: "black",
    boxShadow: "0 3px 3px 2px rgba(0, 0, 0, .3)",
    "&:hover": {
      borderColor: "white",
      color: "white",
    },
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);

const titleStyle =
  window.screen.availWidth < 500 ? { fontsize: "14px" } : { fontsize: "16px" };

const Lobby = (props) => {
  //const styles = useStyles();
  return (
    <TableContainer style={{ maxHeight: 655 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow style={titleStyle}>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Room Name</TableCell>
            <TableCell align="center">State</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Users</TableCell>
            <TableCell align="center">Join</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.lobbyList.map((lobby) => (
            <TableRow key={lobby.name}>
              <TableCell component="th" scope="row" align="center">
                {lobby.id}
              </TableCell>
              <TableCell align="center">{lobby.name}</TableCell>
              <TableCell align="center">{lobby.state}</TableCell>
              <TableCell align="center">{lobby.category}</TableCell>
              <TableCell align="center">{lobby.userList.length} / 6</TableCell>
              <TableCell align="center">
                <StyledButton onClick={() => props.joinLobbyHandler(lobby.id)}>
                  Join
                </StyledButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(Lobby);
