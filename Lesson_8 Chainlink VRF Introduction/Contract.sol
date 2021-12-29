// 1. Callee contract makes a request in a transaction
//      Callee contract or oracle contract emits an event
// 2. Chainlink node (Off-chain) is listening for the event, where the details of the request are logged in the event
// 3. In a second transaction created by the Chainlink node, 
//      it returns the data on-chain by calling a function described by the callee contract
// 4. In the case of the Chainlink VRF, a randomness proof is done to ensure the number is truly random
pragma solidity ^0.6.6;

// 1. Import the "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol" contract
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";


// 2. Have our "ZombieFactory" contract inherit from the "VRFConsumerBase" contract
contract ZombieFactory is VRFConsumerbase {
    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    // 4. Define the `keyHash`, `fee`, and `randomResult` variables. Don't forget to make them `public`.
    bytes32 public keyHash;
    uint256 public fee;
    uint256 public randomResult;

    struct Zombie {
        string name;
        uint dna;
    }

    Zombie[] public zombies;
    // 3. Create a constructor
        // 3.  VRFConsumerbase also has it's own constructor, passing in vrf coordinator and link token
    constructor() VRFConsumerBase(
        0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B,  
        0x01BE23585060835E02B77ef475b0Cc51aA1e0709
    ) public {
        // 5. Fill in the body of the constructor, values are pulled from Chainlink VRF Contract Addresses
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 100000000000000000;
    }

    function _createZombie(string memory _name, uint _dna) private {
        zombies.push(Zombie(_name, _dna));
    }
    // 6.  Create the 'getRandomNumber' function
    function getRandomNumber() public returns(bytes32 requestId){
        return requestRandomness(keyHash, fee);
    }

    // 7.  Create the 'fulfillRandomness' function
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
    }

    function _generatePseudoRandomDna(string memory _str) private view returns(uint){
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }
}