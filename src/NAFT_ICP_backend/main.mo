import NFTActor "./NFT/NFT";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor naft_icp {

    public type NFTData = {
        nftName: Text;
        nftDesc: Text;
        nftPrice: Nat;
        nftToken: Nat;
        nftImageData: Text;
    };




    stable var mintedNFTs = List.nil<Principal>();
    private stable var _nftAndID : [(Principal, NFTData)] = [];

    var nftWithID : HashMap.HashMap<Principal, NFTData> = HashMap.fromIter(_nftAndID.vals(), 0, Principal.equal, Principal.hash);

    system func preupgrade() {
        _nftAndID := Iter.toArray(nftWithID.entries());
    };

    system func postupgrade() {
        _nftAndID := [];
    };

    public func greet() : async Text {
        
        return "Hello,  !";

    };

    public func greetNFT(name : Text) : async Text {
        //let nftMint = await NFTClass.NFT(name);

        //let nftName = await nftMint.getNFTParams();
        //let nftID = Principal.toText(await nftMint.getNFTId());

        let nftName:Text = "Hey";
        
        Debug.print(Nat.toText(Cycles.balance()));
        return "NFT Name: " # nftName # "\nNFT Principal ID: ";

    };

    public shared(msg) func mintNFT(name: Text, desc: Text, price: Int, token: Int, imageData:Text): async Principal {
    
      let obtainedNFT: NFTData = {
        nftName = name;
        nftDesc = desc;
        nftPrice = Int.abs(price);
        nftToken = Int.abs(token);
        nftImageData = imageData;
      };

        Cycles.add(300_000_000_000);

    Debug.print("Cycles updated "# Nat.toText(Cycles.balance()));

      let newNFT = await NFTActor.NFT(name, desc, Int.abs(price), Int.abs(token), imageData);

    Debug.print("New Cycles "# Nat.toText(Cycles.balance()));
      
      let nftID = await newNFT.getNFTId();

      nftWithID.put(nftID, obtainedNFT);

      return nftID;   
    };

    public query func getAllNFTs():async [(Principal, NFTData)] {
        return Iter.toArray(nftWithID.entries());
    };

    public shared(msg) func whoIsCalling(): async Text {
        return Principal.toText(msg.caller);
    }
};
