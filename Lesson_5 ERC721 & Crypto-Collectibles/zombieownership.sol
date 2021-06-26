pragma solidity >=0.5.0 <0.6.0;

import "./zombieattack.sol";
import "./erc721.sol";
import "./safemath.sol";

/// @title contract to take care of moving zombie
/// @author Loc Giang
/// @notice This contract takes care of transfering zombies around through different addresses
contract ZombieOwnership is ZombieAttack, ERC721 {                        

  using SafeMath for uint256;

  mapping (uint => address) zombieApprovals;
  /// Returns how many zombies the address has
  function balanceOf(address _owner) external view returns (uint256) {
    return ownerZombieCount[_owner];
  }
  /// Returns if the token id is from the owner
  function ownerOf(uint256 _tokenId) external view returns (address) {
    return zombieToOwner[_tokenId];
  }
  /// @notice this function calls Transfer event from erc721.sol
  /// @param _from is the address of the current user
  /// @param _to is the address of the user the zombie will go to
  /// @param _tokenId is the id of the zombie
  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerZombieCount[_to] = ownerZombieCount[_to].add(1);                         // increment zombie count of _to address by 1
    ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);           // decrement zombie count of msg.sender by 1
    zombieToOwner[_tokenId] = _to;                                                // zombieToOwner point to _to
    emit Transfer(_from, _to, _tokenId);                                          // emit the event
  }
  /// @notice This function makes sure the msg.sender has the zombie, using zombieToOwner or ZombieApprovals
  /// @param _from is the address of the current user
  /// @param _to is the address of the user the zombie will go to
  /// @param _tokenId is the id of the zombie
  function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
    require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
    _transfer(_from, _to, _tokenId);
  }
  /// @notice this function emit the Approval event from erc721.sol
  /// @param _approved is the approved address
  /// @param _tokenId is the id of the zombie
  function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
    zombieApprovals[_tokenId] = _approved;                                        // set the address of zombieApprovals to the _approved address
    emit Approval(msg.sender, _approved, _tokenId);                               // emits the event
  }

}
