import React, { useState, useRef } from 'react';
import SockJsClient from 'react-stomp';
import './App.css';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { updateData } from './services/TradeService'

const SOCKET_URL = 'http://localhost:8080/ws-order-book';

const App = () => {
  const [trades, setTrades] = useState([]);
  const [symbolPrice, setSymbolPrice] = useState();
  const symbolRef = useRef(null);

  let onConnected = () => {
    console.log("Connected!!")
  }

  let onTradesnMessageReceived = (msg) => {
    setTrades(msg);
  }

  let onSymbolPricenMessageReceived = (msg) => {
    setSymbolPrice(msg);
  }

  let handleSubmit = () => {
    console.log("symbol: " + symbolRef.current.value)
    updateData(symbolRef.current.value)

  }

  return (
    <div style={{padding: "30px"}}>
      <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/trades']}
        onConnect={onConnected}
        onDisconnect={console.log("Disconnected!")}
        onMessage={msg => onTradesnMessageReceived(msg)}
        debug={false}
      />
            <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/symbolPrice']}
        onConnect={onConnected}
        onDisconnect={console.log("Disconnected!")}
        onMessage={msg => onSymbolPricenMessageReceived(msg)}
        debug={false}
      />
<Stack spacing={2} direction="row">
<TextField id="standard-basic" label="Search" variant="standard" inputRef={symbolRef} />
<Button variant="outlined" onClick={handleSubmit}>submit</Button>
</Stack>

<TableContainer component={Paper} >
<Table sx={{ minWidth: 150, width: 300 }} size="small" aria-label=" buyer table">
  <TableHead>
    <TableRow>
      <TableCell>Price</TableCell>
      <TableCell align="center">Amount</TableCell>
      <TableCell align="center">Total</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {trades.filter((item) => item.isBuyerMaker).slice(0, 10).map((row) => (
      <TableRow
        key={row.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row" style={{color: `green`}}>
          <label>{row.price}</label>
        </TableCell>
        <TableCell align="center">{row.qty}</TableCell>
        <TableCell align="center">{row.quoteQty}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
<div>
<p><label>{symbolPrice != undefined ? symbolPrice.price : ""}</label></p>
</div>
<Table sx={{ minWidth: 150, width: 300 }} size="small" aria-label=" seller table">
  <TableHead>
    <TableRow>
      <TableCell>Price</TableCell>
      <TableCell align="center">Amount</TableCell>
      <TableCell align="center">Total</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {trades.filter((item) => !item.isBuyerMaker).slice(0, 10).map((row) => (
      <TableRow
        key={row.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row" style={{color: `red`}}>
          {row.price}
        </TableCell>
        <TableCell align="right">{row.qty}</TableCell>
        <TableCell align="right">{row.quoteQty}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</TableContainer>
</div>
  );
}

export default App;