import logo from './logo.svg';
import './App.css';
import serverInfo from './config.json';
import { useEffect, useState } from 'react';

function App() {
  const serverAddress = serverInfo.SERVER_ADDRESS;
  const [data, setData] = useState({});
  const [coinIds, setCoinIds] = useState([]);
  function getPriceOfCoin(coinStr) {
    const url = `${serverAddress}/coin-price/get/${coinStr}`;
    return fetch(url);
  }
  // On mount getPriceOfCoin then update this.state
  useEffect(() => {

    function getAllCoinIds() {
      const url = `${serverAddress}/coin-price/getallids`;
      return fetch(url);
    }

    getPriceOfCoin("btc-bitcoin").then(local_data => {
      local_data.json().then(data => {
        if(data.length == 0) return;
        setData(data[0])
      });
    }).catch(console.err);

    getAllCoinIds().then(local_data => {
      local_data.json().then(data => {
        setCoinIds(data)
      });
    }).catch(console.err);
  }, []);

  let coinButtons = [];
  for(const coinId in coinIds) {
    const coinData = coinIds[coinId];
    coinButtons.push(
      <button key={coinId} onClick={
      (ev) => {
        console.log(coinData.id);
        getPriceOfCoin(coinData.id).then(local_data => {
          local_data.json().then(data => {
            if(data.length == 0) return;
            setData(data[0])
          });
        }).catch(console.err);
      }
      }>{coinData.id}</button>
    );
  }

  // Display the state
  return (
    <div>
      <header>
        <div className="divide-into">
          <div className="divide-left">
            <div className="button-container">
              {
                coinButtons
              }
            </div>
          </div>
          <div className="divide-right">
            <h1>BANANA ZONE</h1>
            <div className="do-wrap">{ `OPEN: ${data.open} USD` }</div>
            <div className="do-wrap">{ `CLOSE: ${data.close} USD` }</div>
            <div className="do-wrap">{ `HIGH: ${data.high} USD` }</div>
            <div className="do-wrap">{ `LOW: ${data.low} USD` }</div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
