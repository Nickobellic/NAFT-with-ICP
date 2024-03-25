import NFTClass "./NFT/NFT";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";

actor naft_icp {
    public func greet() : async Text {
        
        return "Hello,  !";

    };

    public func greetNFT(name : Text) : async Text {
        Cycles.add(15_000_000_000);
        let nftMint = await NFTClass.NFT(name);

        let nftName = await nftMint.getNFTParams();
        let nftID = Principal.toText(await nftMint.getNFTId());
        
        Debug.print(Nat.toText(Cycles.balance()));
        return "NFT Name: " # nftName # "\nNFT Principal ID: " # nftID # "";

    };

    public shared(msg) func whoIsCalling(): async Text {
        return Principal.toText(msg.caller);
    }
};
