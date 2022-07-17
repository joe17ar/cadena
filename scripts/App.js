import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/Bank.json";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isElectionOrganizer, setIsElectionOrganizer] = useState(false);
  const [inputValue, setInputValue] = useState({ candidateName: "" });
  const [ElectionOrganizerAddress, setElectionOrganizerAddress] = useState(null);
  const [voterVoted, setVoterHasVoted] = useState(false);
  const [voterAddress, setVoterAddress] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = '0x952e69249D0d0ed4E6cac51A9AdDe15a6EB25b24';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setVoterAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to vote.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const setBankNameHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await bankContract.setBankName(utils.formatBytes32String(inputValue.bankName));
        console.log("Setting Bank Name...");
        await txn.wait();
        console.log("Bank Name Changed", txn.hash);
        await getBankName();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getElectionOrganizerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const ElectionContract = new ethers.Contract(contractAddress, contractABI, signer);

        let owner = await bankContract.bankOwner();
        setBankOwnerAddress(owner);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (owner.toLowerCase() === account.toLowerCase()) {
          setIsElectionOrganizer(true);
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const voterStateHanlder = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const ElectionContract = new ethers.Contract(contractAddress, contractABI, signer);

        let state = await bankContract.getVoterStatus();
        setCustomerTotalBalance(state);
        console.log("Retrieved balance...", balance);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getBankName();
    getElectionOrganizerHandler();
    voterStatusHanlder()
  }, [isWalletConnected])

  return (
    <main className="main-container">
      <h2 className="headline"><span className="headline-gradient">Election Contract Project</span> 💰</h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
          {currentBankName === "" && isBankerOwner ?
            <p>"Setup the name of your bank." </p> :
            <p className="text-3xl font-bold">{currentBankName}</p>
          }
        </div>
        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="deposit"
              placeholder="0.0000 ETH"
              value={inputValue.deposit}
            />
            <button
              className="btn-purple"
              onClick={deposityMoneyHandler}>Deposit Money In ETH</button>
          </form>
        </div>
        <div className="mt-10 mb-10">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="withdraw"
              placeholder="0.0000 ETH"
              value={inputValue.withdraw}
            />
            <button
              className="btn-purple"
              onClick={withDrawMoneyHandler}>
              Withdraw Money In ETH
            </button>
          </form>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Customer Balance: </span>{customerTotalBalance}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Bank Owner Address: </span>{bankOwnerAddress}</p>
        </div>
        <div className="mt-5">
          {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{customerAddress}</p>}
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        </div>
      </section>
      {
        isBankerOwner && (
          <section className="bank-owner-section">
            <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Bank Admin Panel</h2>
            <div className="p-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="bankName"
                  placeholder="Enter a Name for Your Bank"
                  value={inputValue.bankName}
                />
                <button
                  className="btn-grey"
                  onClick={setBankNameHandler}>
                  Set Bank Name
                </button>
              </form>
            </div>
          </section>
        )
      }
    </main>
  );
}
export default App;