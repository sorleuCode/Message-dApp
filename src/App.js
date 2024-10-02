import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./abi.json";
import "./App.css";

function App() {
  const [message, setMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [transfer, newTransfer] = useState("");
  const [owner, setOwner] = useState("");
  const [contract, newContract] = useState("");

  //address
  const contractAddress = "0x73e4e8D5C66355335B876A80BBD26dF2c83fbBEA";

  // async function for accessing metamask in our browser
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function getOwner() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const ownerAddress = await contract.owner();
        setOwner(ownerAddress);
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }
  //getMessage function using ethers
  async function getMessage() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const getMsg = await contract.getMessage();
        setMessage(getMsg);
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }

  const handleSubmit = async () => {
    await updateMessage(newMessage);

    await getMessage();
    // await transferOwnership()

    setNewMessage("");
  };

  //set message function using ethers
  async function updateMessage(data) {
    if (typeof window.ethereum !== "undefined") {
      // await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        await contract.setMessage(data);
        const getMsg = await contract.getMessage();
        setMessage(getMsg);
        await getMessage();
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }

  const handleOwnershipTrasnfer = async () => {
    await transferOwnership(transfer);

    newTransfer("");
  };

  async function transferOwnership(data) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const tx = await contract.transferOwnership(data);
        tx.wait();
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }

  // useEffect(() => {
  //   getMessage();
  // }, []);

  return (
    <div className="App">
      <button onClick={requestAccount}>Connect Wallet</button>
      <h1>Message Retrieval DApp</h1>

      <form>
        <h2>
          <span>Message:</span> {message}
        </h2>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter new message"
        />
        <div className="btns">
          <button type="button" onClick={getMessage}>
            Get New Message
          </button>
          <button type="button" onClick={handleSubmit}>
            Set Message
          </button>
        </div>
      </form>

      <form>
        <div>
          <h2>Transfer ownership</h2>
          <h2>
            Owner: <span>{owner}</span>
          </h2>
          <input
            type="text"
            value={transfer}
            onChange={(e) => newTransfer(e.target.value)}
            placeholder="Transfer Ownership"
          />
        </div>
        <div className="btns">
          <button type="button" onClick={handleOwnershipTrasnfer}>
            Transfer ownership
          </button>
          <button type="button" onClick={getOwner}>
            Get Owner
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
