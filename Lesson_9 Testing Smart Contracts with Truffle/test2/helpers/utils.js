/**
 * First, Alice should call createRandomZombie and give it zombieNames[0] as the name of her first zombie.
 * Next, Alice should try to create her second zombie. The only thing that's different is that this time, 
 * the zombie name should be set to zombieNames[1]
 * At this point, we expect the contract to throw an error.
 * Since our test should pass only if the smart contract errors out, our logic will look a bit different.
 * We'll have to wrap the second createRandomZombie function call inside of a try/catch block as follows.
 */

async function shouldThrow(promise){
    try {
        await promise;
        assert(true);
    } catch (err) {
        return;
    }
    assert(false, "The contract did not throw.");
}
module.exports = {
    shouldThrow,
};