const CryptoZombies = artifacts.require("CryptoZombies");
const utils = require("./helpers/utils") // importing the utils from helpers folder
const zombieNames = ["Zombie 1", "Zombie 2"];

// import expect into our project
var expect = require("chai").expect;

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

        // obsolete:
        //assert.equal(result.receipt.status, true);
        //assert.equal(result.logs[0].args.name,zombieNames[0]);
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args.name).to.equal(zombieNames[0]);
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
            const result = await contractInstance.createRandomZombie(zombieName[0], {from: alice});
            
            // 8. The second line should declare a const named zombieId and set it equal to the zombie's id.
            const zombieId = result.logs[0].args.zombieId.toNumber();

            // 9. Then, we have to call transferFrom with alice and bob as the first parameters.
            // Make sure Alice calls this function and we're awaiting for it to finish before moving to the next step.
            await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});

            // 10. Declare const called newOwner.  Set it equal to ownerOf called with zombieId.
            const newOwner = await contractInstance.ownerOf(zombieId);

            // 11. Lastly, let's check whether Bob owns this ERC721 token.  PUtting this into codce, it means we should run
            // assert.equal with newOwner and bob as parameters.
            //obsolette:
            //assert.equal(newOwner, bob);
            expect(newOwner).to.equal(bob);
        })
    })

    context("with the two-step transfer scenario", async ()=>{
        // Now, the approve followed by transferFrom way to transfer ERC721 tokens is far from being a walk in the park
        // In a nutshell, we have to test two different scenarios:
        // Alice approves Bob to take the ERC721 token. Then Bob(the approved address) calls transferFrom.
        // Alice approves Bob to take the ERC721 token. Next, Alice transfers the ERC721 token.
        
        // The difference in the two scenarios lies with who calls the actual transfer, Alice or Bob.
        // We've made it look simple, right?
        // Let's take a look at the first scenario.
        
        // Bob calls transferFrom, the steps for this scenario are as follows:
        // Alice creates a new ERC721 token and then calls approves
        // Next, Bob runs transferFrom which should make him the owner of the ERC721 token.
        // Finally, we have to call assert.equal with newOwner and bob as parameter

        it("should approve and then transfer a zombie when the approved address calls transferFrom", async ()=>{
            // todo: Test the two-sttep scenario.  The approved address calls transferFrom
            // The first two lines of code of our test are similar to the previous test.
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();

            // Next, in order to have Bob approve to take the ERC721 token, call approve().  The function takes bob and zombieId as parameters.
            // Also, make sure that Alice calls the method ( since it's her ERC721 token that will be transfered)
            await contractInstance.approve(bob, zombieId, {from: alice});

            // The last three lines of code are almost similar to the previous test. 
            await contractInstance.transferFrom(alice, bob, zombieId, {from: bob});  // notice the user
            const newOwner = await contractInstance.ownerOf(zombieId);

            //obsolette:
            //assert.equal(newOwner,bob)
            expect(newOwner).to.equal(bob);
        })
        it("should approve and then transfer a zombie when the owner calls transferFrom", async()=>{
            // todo: Test the two-step scenario. The owner calls transferFrom
            // Let's now test the scenario in which Alice calls transferFrom.
            // All you have to do is copy and paste the code from the previous chapter and make it so that Alice (not bob) calls transferFrom.
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.approve(bob, zombieId, {from: alice});
            await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});  // notice the user
            const newOwner = await contractInstance.ownerOf(zombieId);

            //obsolette:
            //assert.equal(newOwner,bob)
            expect(newOwner).to.equal(bob);
        })
    })
    // Test zombies fighting each other
    it ("zombies should be able to attack another zombie", async ()=>{
        let result;
        // create zombie for alice
        result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const firstZombieId = result.logs[0].args.zombieId.toNumber();

        // create zombie for bob
        result = await contractInstance.createRandomZombie(zombieNames[0], {from: bob});
        const secondZombie = result.logs[0].args.zombieId.toNumber();

        await time.increase(time.duration.days(1));   // time travel so that our zombie can attack!

        // alice's zombie attacks bob zombie
        await contractInstance.attack(firstZombieId, secondZombie, {from:alice});

        //obsolette:
        //assert.equal(result.receipt.status, true)
        expect(result.receipt.status).to.equal(true);

        // our test above would fail because we've added a cooldown period to our game.  The zombies would have to wait 1 day after attacking or feeding to attack again.
        // Fortunately, we don't have to wait that much.  In fact, there's no need to wait at all.  That's because Ganache provides a way to move forward in time
        // through two helper functions.
        // evm_increaseTime
        // evm_mine
    })

})
