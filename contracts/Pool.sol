
import "@openzeppelin/contracts-v4/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-v4/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-v4/security/ReentrancyGuard.sol";
import "./interfaces/IERC20Detailed.sol";

contract Pool is ERC20, ReentrancyGuard {

    struct Asset {
        address asset;
    }

    Asset[] public supportedAssets;

    /* EVENTS */

    event Deposit(
        address fundAddress,
        address investor,
        address assetDeposited,
        uint256 amountDeposited,
        uint256 valueDeposited,
        uint256 fundTokensReceived,
        uint256 totalInvestorFundTokens,
        uint256 fundValue,
        uint256 totalSupply,
        uint256 time
    );

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {

    }

    function deposit(address _asset, uint256 _amount) external returns (uint liquidityMinted) {

        uint256 fundValue = totalFundValue();

        uint256 totalSupplyBefore = totalSupply();

        require(IERC20Detailed(_asset).transferFrom(msg.sender, address(this), _amount), "token transfer failed");

        uint256 usdAmount = assetValue(_asset, _amount);

        if (totalSupplyBefore > 0) {
            liquidityMinted = usdAmount * totalSupplyBefore / fundValue;
        } else {
            liquidityMinted = usdAmount;
        }


        _mint(msg.sender, liquidityMinted);

        emit Deposit(
            address(this),
            msg.sender,
            _asset,
            _amount,
            usdAmount,
            liquidityMinted,
            balanceOf(msg.sender),
            fundValue + usdAmount,
            totalSupplyBefore + liquidityMinted,
            block.timestamp
        );
    }

    function withdraw(uint256 _fundTokenAmount) external virtual nonReentrant {
        require(balanceOf(msg.sender) >= _fundTokenAmount, "insufficient balance");

        // TODO: implement
    }

    function totalFundValue() public view returns (uint256) {
        uint256 total = 0;
        uint256 assetCount = supportedAssets.length;

        for (uint256 i = 0; i < assetCount; i++) {
            total = total + assetValue(supportedAssets[i].asset);
        }
        return total;
    }

    function assetValue(address asset) public view returns (uint256 value) {
        value = assetValue(asset, assetBalance(asset));
    }

    function assetValue(address asset, uint256 amount) public view returns (uint256 value) {
        uint256 price = getAssetPrice(asset);
        uint256 decimals = assetDecimal(asset);

        value = price * amount / (10**decimals);
    }

    function getAssetPrice(address asset) public view returns (uint256 price) {
        // TODO: implement
    }

    function assetDecimal(address asset) public view returns (uint256 price) {
        return IERC20Detailed(asset).decimals();
    }

    function assetBalance(address asset) public view returns (uint256 balance) {
        return IERC20Detailed(asset).balanceOf(address(this));
    }

    function tokenPrice() external view returns (uint256 price) {
        uint256 fundValue = totalFundValue();
        uint256 tokenSupply = totalSupply();

        price = _tokenPrice(fundValue, tokenSupply);
    }

    function _tokenPrice(uint256 _fundValue, uint256 _tokenSupply) internal pure returns (uint256 price) {
        if (_tokenSupply == 0 || _fundValue == 0) return 0;

        price = _fundValue * 1e18 / _tokenSupply;
    }
}
