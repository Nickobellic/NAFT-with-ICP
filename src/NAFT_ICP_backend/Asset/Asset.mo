import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";

actor class Asset(asset_type: Text, name: Text, desc: Text, price: Int,tags: Text, token: Int, assetData: Text) = this {
    
    private let nftName = name;
    //private let nftData = image;
    //Cycles.add(18_000_000_000);


    public func getAssetParams() : async Text {
        return nftName;
    }; 

    public func getAssetId() : async Principal {
        return Principal.fromActor(this);
    };

}