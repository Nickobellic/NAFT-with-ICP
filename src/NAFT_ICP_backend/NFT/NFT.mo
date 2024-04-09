import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";

actor class NFT(name: Text) = this {
    private let nftName = name;

    public func getNFTParams() : async Text {
        return nftName;
    }; 

    public func getNFTId() : async Principal {
        return Principal.fromActor(this);
    };

}