/* 
Group tests by calling a function named contract().  It extends Mocha's describe() by providing a list of accounts for testing and doing some cleanup as well.
contract() takes two arguments.  The first one, a string, must indicate what we're going to test. 

The second parameter, a callback, is where we're going to actually write our tests.

Execute them: the way we'll be doing this is by calling a function named it() which also takes two arguments: 
a string that describes what the test actually does and a callback

Putting it together, here's a bare-bones test:

contract("MyAwesomeContract",(account) =>{
    it("should be albe to receive Ethers",()=>{
    })
})
Note: A well-thought test explains what the code actually does. 
*/

// 1.  The first line of code should decalre a const called CryptoZombies and set it equal to the result of the artifacts.require
// function with the name of the contract we want to test as an argument

const CryptoZombies = artifacts.require("CryptoZombies");

// 2. Next copy and paste the code from above
// 3. Change the way we're calling contract() such that the first parameter is the name of our smart contract.
    // Note: Don't worry about the accounts argument. We'll explain it in the next chapter.
// 4. The first parameter passed to the it() function  (in our example, that is "should be able to receive Ethers") 
    // should be the name of our test. Since we'll start with creating a new zombie, 
    // make sure that the first parameter is set to "should be able to create a new zombie".

// 7. Initialize zombienames array
const zombieNames = ["Zombie 1", "Zombie 2"];

contract("CryptoZombies", (accounts)=>{
    // 5. initialize 'alice' and 'bob'
    let [alice, bob] = accounts;
    // 6. Next, we would want to properly call the it() function. The second parameter (a callback function) is going to "talk" to the blockchain, 
    // which means that the function is asynchronous. 
    // Just prepend the async keyword. This way, every time this function gets called with the await keyword, our test waits for it to return.
    it("should be albe to create a new zombie",async ()=>{
        // 7. Let's create an instance of our contract. Declare a new const named contractInstance and set it equal to the result of the CryptoZombies.new() function
        // CryptoZombies.new() "talks" to the blockchain.  This means that it's an asynchoronous function.  Let's add the await keyword before the function call.
        const contractInstance = await CryptoZombies.new();

        // 8. Declare a const named result, and set it equal to the result of contractInstance.createRandomZombie with the zombie's name and the owner as arguments.
        const result = await contractInstance.createRandomZombie(ZombieNames[1], {from: alice});
        // 9  Once we have the result, call assert.equal with two arguments - result.receipt.status and true
        assert.equal(result.receipt.status, true);
        // 10. In the next line, check if result.logs[0].args.name equals to zombieNames[0]. Use assert.equal, just like we did above.
        assert.equal(result.logs[0].args.name, zombieNames[0]);
    })
})
