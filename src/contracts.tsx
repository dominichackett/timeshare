const calibrationFilecoin=0
const arbitrumSepolia=1
const GnosisChain=2
const MorphTestnet=3
const NeonDevnet=4


export const timeShareTokenAddress = new Map([[calibrationFilecoin,"0x939A9E6EaAc97e0F9280b869335995E84413c0c4"]
,[arbitrumSepolia,"0x540Bb4Cb0B404ba3535875192912c9786208AC79"]
,[GnosisChain,"0xd719b2Fee8A6bb8b7417DEc352793cabbf503B74"]
,[MorphTestnet,"0x76B4657819EF6C6a6E63A703B8C852174e3b3431"]
,[NeonDevnet,"0x76B4657819EF6C6a6E63A703B8C852174e3b3431"]
])

export const timeShareTokenABI = ['function fractionalise(string memory name_,string memory symbol_,uint8 decimals_,uint256 maxTotalSupplyERC721_,address initialOwner_,address initialMintRecipient_) public',
'function purchase(uint256 id_, uint quantity_, string memory _currency) public',
   'function tokenAddress(uint256 _tokenId) public view returns (address)',

'function list(uint256 id_, uint quantity_, uint price_) public',
'function getBalanceOfToken(address _address, address _user) public view returns (uint)',
'event Purchased(uint256 indexed timeshareId,address indexed owner,uint256 price,uint256 quantity)',
'event TimeshareCreated( uint256 indexed timeshareId,address indexed owner,string indexed tokenName,uint quantity)',
'event Listed(uint256 indexed timeshareId,address indexed owner,uint256 indexed listing,uint256 price,uint quantity)']


export const usdcTokenAddress = new Map([[calibrationFilecoin,"0xd2dBA47c76592322DBdD9AF12278e24ef11C940D"]
,[arbitrumSepolia,"0x9535C4c184bE5627FF077079215d1bcdfE9352e2"]
,[GnosisChain,"0xD8dF761D4D24b6b0ae240C96AC1fC03b74a57e73"]
,[MorphTestnet,"0x8170d274D3b905ca7E6C06C9cA3667fD26011C93"]
,[NeonDevnet,"0x8170d274D3b905ca7E6C06C9cA3667fD26011C93"]
])

export const tokenABI = [ "function erc20Approve(address spender_,uint256 value_) external returns (bool)",
"function setApprovalForAll(address operator_, bool approved_) public"
]

export const usdcTokenABI = [
    // 'function transfer(address to, uint256 amount) external returns (bool)',
    "function approve(address spender, uint256 amount) public",
    "function mint() public",
    ];
  
  