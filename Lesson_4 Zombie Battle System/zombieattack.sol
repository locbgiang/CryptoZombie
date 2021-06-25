pragma solidity >=0.5.0 <0.6.0;

import "./zombiehelper.sol";

contract ZombieAttack is ZombieHelper {
  uint randNonce = 0;
  uint attackVictoryProbability = 70;                                                         // chance of your zombie winning is 70%

  function randMod(uint _modulus) internal returns(uint) {                                    // returning a random number
    randNonce++;
    return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;          // encode with keccak then turn into uint
  }

  function attack(uint _zombieId, uint _targetId) external ownerOf(_zombieId) {               // zombie attackiing
    Zombie storage myZombie = zombies[_zombieId];
    Zombie storage enemyZombie = zombies[_targetId];
    uint rand = randMod(100);
    if (rand <= attackVictoryProbability) {                                                   // if your zombie win, raise level, and win counter
      myZombie.winCount++;
      myZombie.level++;
      enemyZombie.lossCount++;
      feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");                                  // run feedAndMultiply function
    } else {                                                                                  // else zombie lose
        myZombie.lossCount++;
        enemyZombie.winCount++;
        _triggerCooldown(myZombie);                                                           // trigger cooldown
    }
  }
}
