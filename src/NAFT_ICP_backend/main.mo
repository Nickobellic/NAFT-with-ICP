import NFTActor "./NFT/NFT";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Bool "mo:base/Bool";

actor naft_icp {

    public type NFTData = {
        nftName: Text;
        nftDesc: Text;
        nftPrice: Nat;
        nftToken: Nat;
        nftImageData: Text;
    };




    stable var mintedNFTs = List.nil<Principal>();
    private stable var _nftAndIDList : [(Principal, NFTData)] = [];
    private stable var _ownersAndNFTList: [(Principal, [Principal])] = [];

    var nftWithIDHashMap : HashMap.HashMap<Principal, NFTData> = HashMap.fromIter(_nftAndIDList.vals(), 0, Principal.equal, Principal.hash);
    var ownersAndNFTHashMap: HashMap.HashMap<Principal, [Principal]> = HashMap.fromIter(_ownersAndNFTList.vals(), 0, Principal.equal, Principal.hash);

    system func preupgrade() {
        _nftAndIDList := Iter.toArray(nftWithIDHashMap.entries());
        _ownersAndNFTList := Iter.toArray(ownersAndNFTHashMap.entries());
    };

    system func postupgrade() {
        _nftAndIDList := [];
        _ownersAndNFTList := [];
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

    public shared(msg) func mintNFT(name: Text, desc: Text, price: Int, token: Int, imageData:Text, minter: Principal): async Principal {
    
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

      nftWithIDHashMap.put(nftID, obtainedNFT);
      var prevBoughtNFTList = ownersAndNFTHashMap.get(minter);
      switch(prevBoughtNFTList) {
        case null {
            ownersAndNFTHashMap.put(minter, [nftID]);
        };

        case(?prevBoughtNFTList) {
            let availableNFTs = Buffer.fromArray<Principal>(prevBoughtNFTList);
            availableNFTs.add(nftID);
            ownersAndNFTHashMap.put(minter, Buffer.toArray<Principal>(availableNFTs));
        }

      };

      return nftID;   
    };

    public query func getAllNFTs():async [(Principal, NFTData)] {
        return Iter.toArray(nftWithIDHashMap.entries());
    };

    public shared(msg) func whoIsCalling(): async Text {
        return Principal.toText(msg.caller);
    };

    public query func getYourNFTs(princID: Principal): async [Principal] {
        let allNFTs = ownersAndNFTHashMap.get(princID);

        switch(allNFTs) {
            case(?allNFTs) {
                return allNFTs;
            };

            case(null) {
                return [];
            }
        };
    };

    public query func getOwner(nftID: Principal): async Text {
        for (key in ownersAndNFTHashMap.keys()) {
            let ownerNFTs = ownersAndNFTHashMap.get(key);
            switch(ownerNFTs) {
                case(?ownerNFTs) {
                    let isFound = Array.find<Principal>(ownerNFTs, func(x:Principal) {x == nftID});
                    switch(isFound){
                        case(?isFound){
                            return Principal.toText(key);
                        };
                        case(null) {
                            return "";
                        }
                    }
                };
                case(null) {};
            };
        };
        return "";
    }
};
