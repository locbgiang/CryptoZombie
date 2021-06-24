pragma solidity >=0.5.0 <0.6.0;

contract ZombieFactory {
    event NewZombie(uint zombieId, string name, uint dna);      // events are a way for contract to communicate that something happened on the blockchain to your app
    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    struct Zombie { 
        string name;
        uint dna;
    }

    Zombie[] public zombies;

    function _createZombie(string memory _name, uint _dna) private {
        uint id = zombies.push(Zombie(_name, _dna))-1;          // getting the id the length of the array-1
        emit NewZombie(id, _name, _dna);                        // firing the event
    }

    function _generateRandomDna(string memory _str) private view returns(uint){
        uint rand = uint(keccak256(abi.encodePack(_str)));      // generating random dna using keccak256 with the zombie name
        return rand % dnaModulus;                               // making sure the dna does not go over the modulus
    }

    function createRandomZombie(string memory _name) public {
        uint randDna = _generateRandomDna(_name);                // get dna
        _createZombie(_name, randDna);                           // create the zombie
    }
}