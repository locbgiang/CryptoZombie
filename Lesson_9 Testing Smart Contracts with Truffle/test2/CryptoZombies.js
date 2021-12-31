const CryptoZombies = artifacts.require("CryptoZombies");
const utils = require("./helpers/utils") // importing the utils from helpers folder
const zombieNames = ["Zombie 1", "Zombie 2"];
contract("CryptoZombies", (accounts) => {
    let [alice, bob] = accounts;

    // 1. Let's declare a variable named contractInstance.  Don't assign it to anything.
    let contractInstance;
    // 2. One of Mocha's (and Truffle's) features is the ability to have some snipplets of code called hooks run before or after a test.
    // To run something before a test gets executed, the code should be put inside a function named beforeEach().
    beforeEach(async ()=>{
        // 3. Let's fill in the body of our new function. Go ahead and move the line of code that creates a new contract instance inside of the beforeEach() function.
        contractInstance = await CryptoZombies.new();
    });
    
    it("should be able to create a new zombie", async () => {
        //const contractInstance = await CryptoZombies.new();
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.name,zombieNames[0]);
    })

    //define the new it() function
    // 4. We're going to want a new empty it function for our test. Set the name of the test (that is the first parameter we're passing to the it function)
    // equal to "should not allow two zombie"
    it("should not allow two zombies", async ()=>{
        // 5.  Let's have Alice create her first zombie, Give it zombieNames[0] as the name and don't forget to properly set the owner
        await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        // 6.  After Alice create her first zombie, run shouldThrow with createRandomZombie as the parameter.
        await utils.shouldThrow(contractInstance.createRandomZombie(zombieNames[1], {from:alice}));
    })

    // Say Alice wants to send her zombie to Bob.  How do we test this?
    // ERC721 specification has 2 different ways to transfer tokens:

    // function transferFrom(address _from, address _to, unit256 _tokenId) external payable;

    // function approve(address _approved, uint256 _tokenId) external payable;
    // followed by
    // function transferFrom(address _from, address _to, uint256 _tokenId) external payable;

    // First, we must check if Alice herself is able to transfer the zombie.
    // Second, we also have to check if Bob is allowed to run transferFrom.

    context("with the single-step transfer scenario", async ()=>{
        it("should transfer a zombie", async()=>{
            // Todo: Test the single-step transfer scenario.
            // Here is what our test should do:
            // Create a new zombie for Alice(Remember that a zombie is nothing more than an ERC721)
            // make it so that Alice transfer her ERC721 token to bob
            // At this point, Bob should won the ERC721 token, if so, ownerOf would return a value that is equal to Bob's address
            // Let's wrap it up by checking if Bob is the newOwner, inside and assert.

            // 7.  The first line of the function should call createRandomZombie.  Give it zombieNames[0] as the name and make sure Alice is the owner
            await contractInstance.createRandomZombie(zombieName[0], {from: alice});
            
            // 8. The second line should declare a const named zombieId and set it equal to the zombie's id.
            const zombieId = result.log[0].args.zombieId.toNumber();

            


        })
    })

    xcontext("with the two-step transfer scenario", async ()=>{
        it("should approve and then transfer a zombie when the approved address calls transferFrom", async ()=>{
            // todo: Test the two-sttep scenario.  The approved address calls transferFrom
        })
        it("should approve and then transfer a zombie when the owner calls transferFrom", async()=>{
            // todo: Test the two-step scenario. The owner calls transferFrom
        })
    })
})
