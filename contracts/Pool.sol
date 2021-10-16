
import "@openzeppelin/contracts-v4/token/ERC20/IERC20.sol";

contract Pool {

    struct Asset {
        address asset;
    }

    Asset[] public supportedAssets;

    function deposit(address _asset, uint256 _amount) external view returns (uint liquidityMinted) {

    }

    /// @notice Return the total fund value of the pool
    /// @dev Calculate the total fund value from the supported assets
    /// @return value in USD
    function totalFundValue() external view returns (uint256) {
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

    /// @notice Get value of the asset
    /// @param asset address of the asset
    /// @param amount amount of the asset
    /// @return value of the asset
    function assetValue(address asset, uint256 amount) public view returns (uint256 value) {
        uint256 price = getAssetPrice(asset);
        uint256 decimals = assetDecimal(asset);

        value = price * amount / (10**decimals);
    }

    function getAssetPrice(address asset) public view returns (uint256 price) {

    }

    function assetDecimal(address asset) public view returns (uint256 price) {

    }

    function assetBalance(address asset) public view returns (uint256 balance) {
    }
}
