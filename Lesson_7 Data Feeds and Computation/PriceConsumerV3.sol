pragma solidity ^0.6.0.7;

// To work with the Chainlink Data Feeds contracts, import the "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol" contract.
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    // 1. Create a `public` variable named `priceFeed` of type `AggregatorV3Interface`.
    AggregatorV3Interface public priceFeed;

    // 2. Create a constructor
    // 3. Instantiate the `AggregatorV3Interface` contract
    constructor() public{
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    }
    // 4. Create a public view function named getLatestPrice. The function returns an int
    function getLatestPrice() public view returns(int){
        // 5. Call the latestRoundData function of thepriceFeed contract, and store only the answer in an int variable named price. 
        // Exclude any other variables from being declared in our function call. 
        // (uint80 roundId, int price, uint startedAt, uint updatedAt, uint80 answeredInRound)
        (,int price,,,) = priceFeed.latestRoundData();

        // 6. Return Price
        return price;
    }

    // 6. Create a public view function called getDecimals that returns the result of the decimals function from the AggregatorV3Interface. 
    // When you declare the function, keep in mind that the return value is a uint8.
    function getDecimals() public view returns (uint8) {
        // 7. The first line of code should call the priceFeed.decimals() function, and store the result in a variable named decimals of type uint8.
        uint8 decimals = priceFeed.decimals();
        // 8. The second line of the function should return the decimals variable.
        return decimals;
    }
}