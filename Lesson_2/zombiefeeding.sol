pragma solidity >= 0.5.0 < 0.6.0;

import './zombiefactory.sol'

contract KittyInterface {
    function getKitty(uint256 _id) external view returns {
        bool isGestating,
        bool isRead,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes
    };
}

contract ZombieFeeding is ZombieFactory {
    
    address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;                             // address of cryptokittes
    KittyInterface kittyContract = kittyInterface(ckAddress);                                   // getting the kitty

     function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public{  // feeding on kitty function
        require(msg.sender == zombieToOwner[_zombieId]);                                        // making sure there is a zombie in your address
        Zombie storage myZombie = zombies[_zombieId];                                           // get the zombie from your address with zombie id
        _targetDna = _targetDna % dnaModulus;                                                   // get dna of kitty
        uint newDna = (myZombie.dna + _targetDna) / 2;                                          // create new dna of zombie kitty
        if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {    // making sure the species is a kitty
            newDna = newDna - newDna % 100 + 99;                                                // replacing the last two digits of new dna with 99
        }
        _createZombie('NoName', newDna);                                                        // create new zombie kitty
    }
    
    function feedOnKitty(uint _zombieId, uint _kittyId) public {                                // main function
        uint kittyDna;                                                                          
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);                                 // getting kittyDna with given id
        feedAndMultiply(_zombieId, kittyDna, "kitty");                                          // calling feedandmultiply to create new zombie kitty
    }
}