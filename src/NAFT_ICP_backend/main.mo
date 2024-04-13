import NFTClass "./NFT/NFT";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Int "mo:base/Int";

actor naft_icp {

    public type NFTData = {
        nftName: Text;
        nftDesc: Text;
        nftPrice: Nat;
        nftToken: Nat;
        nftImageData: [Int];
    };

    stable var mintedNFTs = List.nil<NFTData>();

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

    public func mintNFT(name: Text, desc: Text, price: Int, token: Int, imageData:[Int]): async NFTData {
    

      let obtainedNFT: NFTData = {
        nftName = name;
        nftDesc = desc;
        nftPrice = Int.abs(price);
        nftToken = Int.abs(token);
        nftImageData = imageData;
      };

      mintedNFTs := List.push(obtainedNFT, mintedNFTs);

      return obtainedNFT;   
    };

    public query func getAllNFTs():async [NFTData] {
        return List.toArray(mintedNFTs);
    };

    public shared(msg) func whoIsCalling(): async Text {
        return Principal.toText(msg.caller);
    }
};
