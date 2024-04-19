const calibrationFilecoin=0
const arbitrumSepolia=1
const GnosisChain=2
const MorphTestnet=3
const NeonDevnet=4


export const timeShareTokenAddress = new Map([[calibrationFilecoin,"0xD238246168278E2dE843b573f9Ff04db8c22f1aC"]
,[arbitrumSepolia,"0x564a4aC7716F9c5540E0afE163391146e99AA10d"]
,[GnosisChain,"0x8d5862b0568A2d644be4C406bf6763C025dd8535"]
,[MorphTestnet,"0x64C5668B710E751D4C0F068cf6D45FF07fFdB32a"]
,[NeonDevnet,"0x64C5668B710E751D4C0F068cf6D45FF07fFdB32a"]
])

export const timeShareTokenABI = ['function fractionalise(string memory name_,string memory symbol_,uint8 decimals_,uint256 maxTotalSupplyERC721_,address initialOwner_,address initialMintRecipient_) public',
'function purchase(uint256 id_, uint quantity_, string memory _currency) public',
'function list(uint256 id_, uint quantity_, uint price_) public',
'event Purchased(uint256 indexed timeshareId,address indexed owner,uint256 price,uint256 quantity)',
'event TimeshareCreated( uint256 indexed timeshareId,address indexed owner,string indexed tokenName,uint quantity)',
'event Listed(uint256 indexed timeshareId,address indexed owner,uint256 indexed listing,uint256 price,uint quantity)']


export const usdcTokenAddress = new Map([[calibrationFilecoin,"0xD238246168278E2dE843b573f9Ff04db8c22f1aC"]
,[arbitrumSepolia,"0x564a4aC7716F9c5540E0afE163391146e99AA10d"]
,[GnosisChain,"0x8d5862b0568A2d644be4C406bf6763C025dd8535"]
,[MorphTestnet,"0x64C5668B710E751D4C0F068cf6D45FF07fFdB32a"]
,[NeonDevnet,"0x64C5668B710E751D4C0F068cf6D45FF07fFdB32a"]
])


export const usdcTokenABI = [
    // 'function transfer(address to, uint256 amount) external returns (bool)',
    "function approve(address spender, uint256 amount) public",
    "function mint() public"
  ];
  
  