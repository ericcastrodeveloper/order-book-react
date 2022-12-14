import axios from "axios";

export const updateData = (symbol) => {
    Promise.all([axios.get('http://localhost:8080/binance/send/symbolPrice?symbol=' + symbol), axios.get('http://localhost:8080/binance/send/trades?symbol=' + symbol)])
     
}