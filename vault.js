const CHAIN_ID = "0x5";
const CHAIN_NAME = "Goerli";
const CONTRACT_ADDRESS = "0x6012bc0b7DD409239ff084cc804E8A75A9d30a83";
const CONTRACT_ABI = fetch("./vault-abi.json");

const depositform = document.getElementById("depositform");
depositform.addEventListener("deposit", async (e) => {
    e.preventDefault();

    let deposit = document.getElementById("deposit");
    deposit = deposit.value;
    
    let CONTRACT_ABI = await fetch("./vault-abi.json");
    CONTRACT_ABI = await CONTRACT_ABI.json();

    const iface = new ethers.utils.Interface(CONTRACT_ABI);
    const encodedData = iface.encodeFunctionData(deposit, [amount])
    try {
        const deposit = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [{
                from: window.ethereum.selectedAddress,
                to: CONTRACT_ADDRESS,
                data: encodedData
            }]
        })
    } catch (error) {
        alert ("something went wrong with ur tx");
        return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const encodedFilterTopic = iface.encodedFilterTopic("Deposited", [])
    let foundEvent = false
    while (!foundEvent) {
        await new Promise(r => setTimeout(r, 5000)) // sleep 5 sec
        let currentBlockNumber = await provider.getBlockNumber();
        console.log("currentBlockNumber ", currentBlockNumber);
        let oldBlockNumber = Number(currentBlockNumber) - 5;
        let logResult = await provider.getLogs({
            from: oldBlockNumber,
            to: currentBlockNumber,
            topics: encodedFilterTopic
        })
        console.log(logResult)
        try {
            const results = Number(logResult[0]["topics"][2]);
            alert("Amount deposited: " + String(results));
            return
        } catch (error) {
            console.log(error)
            alert("tx pending, sleeping 5 sec");
        }
    } 
})

// const provider = new ethers.providers.Web3Provider(window.ethereum);

// async function withdraw() {
//     let withdrawAmount = document.getElementById("withdraw").value;

//     if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
//         alert("Please enter a valid withdrawal amount.");
//         return;
//     }

//     const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider.getSigner());

//     try {
//         const tx = await contract.Withdraw(withdrawAmount);

//         await tx.wait();

//         alert("Withdrawal successful! Amount withdrawn: " + withdrawAmount);
//     } catch (error) {
//         console.error(error);
//         alert("Withdrawal failed. Please check the console for more details.");
//     }
// }

// async function deposit() {
//     let depositAmount = document.getElementById("deposit").value;

//     if (isNaN(depositAmount) || depositAmount <= 0) {
//         alert("Please enter a valid deposit amount.");
//         return;
//     }

//     const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider.getSigner());

//     try {
//         const tx = await contract.deposit(getSigner, depositAmount);

//         await tx.wait();

//         alert("Deposit successful! Amount deposited: " + depositAmount);
//     } catch (error) {
//         console.error(error);
//         alert("Deposit failed. Please check the console for more details.");
//     }
// }



async function connectWallet() {
    if (!window.ethereum) {
        alert("No injected provider found. Install Metamask.");
    } else {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const account = accounts[0];

            const chainId = await window.ethereum.request({
                method: "eth_chainId",
            });

            if (chainId !== CHAIN_ID) {
                alert("Connected to wrong chain! Please change to " + CHAIN_NAME)
            } else {
                alert("Connected to account: " + String(account) + " and chainID: " + String(chainId));
            }

        } catch {
            alert("Something went wrong connecting. Refresh and try again.");
        }
    }
}

