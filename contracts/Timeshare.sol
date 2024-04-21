//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Token404} from "./Token404.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TimeShare {

    struct ListObject{   
        address holder;   
        uint256 timeshareId;  
        uint quantity;
        uint price;

    }
    event Listed(
        uint256 indexed timeshareId,
        address indexed owner,
        uint256 indexed listing,
        uint256 price,
        uint quantity
    );

    event TimeshareCreated( uint256 indexed timeshareId,
        address indexed owner,
        string indexed tokenName,
        uint quantity);

    event Purchased(uint256 indexed timeshareId,
        address indexed owner,uint256 price,uint256 quantity);    

     using Counters for Counters.Counter;
    Counters.Counter private timeshareId;
    Counters.Counter private listingId;
    mapping(uint256 => ListObject) public Listings;
    mapping(uint256 => Token404) public tokenAddress;
    mapping(string => address) public tokenList;

    function addUSDContracts(string memory _name, address _tokenContract) public  {
        tokenList[_name] = _tokenContract;
    }

    function getBalanceOfToken(address _address, address _user) public view returns (uint) {
        return IERC20(_address).balanceOf(_user);
    }
    

    function fractionalise(string memory name_,
                            string memory symbol_,
                            uint8 decimals_,
                            uint256 maxTotalSupplyERC721_,
                            address initialOwner_,
                            address initialMintRecipient_) public {

        Token404 token404 = new Token404(name_,symbol_,decimals_,maxTotalSupplyERC721_,initialOwner_,initialMintRecipient_);
        uint256 id = timeshareId.current();
        tokenAddress[id] = token404;
        timeshareId.increment();
        emit TimeshareCreated( id,msg.sender, name_,maxTotalSupplyERC721_);
    

    }

    function list(uint256 id_, uint quantity_, uint price_) public {

        uint256 lId =listingId.current();
        Listings[lId] = ListObject(msg.sender,id_, quantity_, price_);
        require(tokenAddress[id_].erc20BalanceOf(msg.sender) >= quantity_);
        tokenAddress[id_].erc20TransferFrom(msg.sender,address(this),quantity_);
        listingId.increment();
        emit Listed(id_,msg.sender,lId,price_, quantity_);

    }

    function purchase(uint256 id_, uint quantity_, string memory _currency) public {

        require(tokenAddress[Listings[id_].timeshareId].erc20BalanceOf(address(this)) >= quantity_);
        require(Listings[id_].quantity >= quantity_);
        Listings[id_].quantity -= quantity_;
        tokenAddress[Listings[id_].timeshareId].transfer(msg.sender,quantity_);
        uint amountToBePaid = quantity_ * Listings[id_].price;
        require(getBalanceOfToken(tokenList[_currency], msg.sender) > amountToBePaid);
        IERC20(tokenList[_currency]).transferFrom(msg.sender, Listings[id_].holder, amountToBePaid);
        emit Purchased(Listings[id_].timeshareId,msg.sender,Listings[id_].price, quantity_);    
 
         


    }

}