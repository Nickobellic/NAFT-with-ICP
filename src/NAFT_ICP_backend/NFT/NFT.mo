import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";

actor class NFT(name: Text, desc: Text, price: Int, token: Int, imageData: Text) = this {
    
    private let nftName = name;
    //private let nftData = image;
    //Cycles.add(18_000_000_000);


    public func getNFTParams() : async Text {
        return nftName;
    }; 

    public func getNFTId() : async Principal {
        return Principal.fromActor(this);
    };

}