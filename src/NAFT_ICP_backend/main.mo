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
import Prelude "mo:base/Prelude";

actor naft_icp {

    private type NFTData = {
        nftName: Text;
        nftDesc: Text;
        nftPrice: Nat;
        nftTags: Text;
        nftToken: Nat;
        nftImageData: Text;
    };

    private type AuctionData = {
        assetID: Principal;
        startingPrice: Nat;
        totalHours: Nat;
        docType: Text;
    };

    private type BiddingData = {
        bidderID: Principal;
        bidAmount: Nat;
        bidTime: Text;
    };

    stable var mintedNFTs = List.nil<Principal>();
    private stable var _nftAndIDList : [(Principal, NFTData)] = [];
    private stable var _ownersAndNFTList: [(Principal, [Principal])] = [];
    private stable var _auctionOwnersAndNFTList: [(Principal,[Principal])] = [];
    private stable var _nftWithAuctionDetailsList: [(Principal, AuctionData)] = [];
    private stable var _auctionNFTIDwithNFTDataList: [(Principal, NFTData)] = [];
    private stable var bidTransactionList = List.nil<BiddingData>();

    var nftWithIDHashMap : HashMap.HashMap<Principal, NFTData> = HashMap.fromIter(_nftAndIDList.vals(), 0, Principal.equal, Principal.hash);
    var ownersAndNFTHashMap: HashMap.HashMap<Principal, [Principal]> = HashMap.fromIter(_ownersAndNFTList.vals(), 0, Principal.equal, Principal.hash);
    var auctionOwnersAndNFTHashMap: HashMap.HashMap<Principal, [Principal]> = HashMap.fromIter(_auctionOwnersAndNFTList.vals(), 0, Principal.equal, Principal.hash);
    var nftWithAuctionDetailsHashMap: HashMap.HashMap<Principal, AuctionData> = HashMap.fromIter(_nftWithAuctionDetailsList.vals(), 0, Principal.equal, Principal.hash);
    var auctionNFTIDwithNFTDataHashMap: HashMap.HashMap<Principal, NFTData> = HashMap.fromIter(_auctionNFTIDwithNFTDataList.vals(), 0, Principal.equal, Principal.hash);

    system func preupgrade() {
        _nftAndIDList := Iter.toArray(nftWithIDHashMap.entries());
        _ownersAndNFTList := Iter.toArray(ownersAndNFTHashMap.entries());
        _auctionOwnersAndNFTList := Iter.toArray(auctionOwnersAndNFTHashMap.entries());
        _nftWithAuctionDetailsList := Iter.toArray(nftWithAuctionDetailsHashMap.entries());
        _auctionNFTIDwithNFTDataList := Iter.toArray(auctionNFTIDwithNFTDataHashMap.entries());
    };

    system func postupgrade() {
        _nftAndIDList := [];
        _ownersAndNFTList := [];
        _auctionOwnersAndNFTList := [];
        _nftWithAuctionDetailsList := [];
        _auctionNFTIDwithNFTDataList := [];
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

    public shared(msg) func mintNFT(tags:Text,name: Text, desc: Text, price: Int, token: Int, imageData:Text, minter: Principal, auctionMint: Bool, startingAmount: Int, auctionHours: Int): async Principal {
    
      let obtainedNFT: NFTData = {
        nftName = name;
        nftDesc = desc;
        nftPrice = Int.abs(price);
        nftToken = Int.abs(token);
        nftImageData = imageData;
        nftTags = tags;
      };

        Cycles.add(300_000_000_000);

    Debug.print("Cycles updated "# Nat.toText(Cycles.balance()));

      let newNFT = await NFTActor.NFT(name, desc, Int.abs(price), Int.abs(token), imageData);

    Debug.print("New Cycles "# Nat.toText(Cycles.balance()));
      
      let nftID = await newNFT.getNFTId();

      if(auctionMint == false) {
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

      return nftID; } else {
        let auctionDetails: AuctionData = {
                    assetID: Principal = nftID;
                    startingPrice: Nat = Int.abs(startingAmount);
                    totalHours: Nat = Int.abs(auctionHours);
                    docType: Text = "NFT";
                };
        nftWithAuctionDetailsHashMap.put(nftID, auctionDetails); // Map NFT ID with Auction details
        auctionNFTIDwithNFTDataHashMap.put(nftID, obtainedNFT); // Map NFT ID with NFT data details
        var previousAuctionsByMinter = auctionOwnersAndNFTHashMap.get(minter);
        switch(previousAuctionsByMinter) {
            case(?previousAuctionsByMinter) {
                let previousAuctionsBuffer = Buffer.fromArray<Principal>(previousAuctionsByMinter);
                previousAuctionsBuffer.add(nftID);
                auctionOwnersAndNFTHashMap.put(minter, Buffer.toArray<Principal>(previousAuctionsBuffer));
                return nftID;
            }; case(null) {
                let firstAuctionByMinter = [nftID];
                auctionOwnersAndNFTHashMap.put(minter, firstAuctionByMinter);
                return nftID;
            }
        }
      }  
    };

    public query func fetchAllAuctionDetails(): async [AuctionData] {
        let allAuctionDetails = Iter.toArray(nftWithAuctionDetailsHashMap.vals());
        return allAuctionDetails;
    };

    public query func fetchAllAuctionAssets(): async [Principal] {
        let allAuctionAssetPrincipals = Iter.toArray(nftWithAuctionDetailsHashMap.keys());
        return allAuctionAssetPrincipals;
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
    };

    public func transferNFT(nftID: Principal,from_principal: Principal, to_principal: Principal): async Text {
        let ownedNFTs = ownersAndNFTHashMap.get(from_principal);
        switch(ownedNFTs) {
            case(?ownedNFTs) {
                let found = Array.find<Principal>(ownedNFTs, func(x:Principal) {x == nftID});
                switch(found) {
                    case(?found) {
                        let newNFTList = Array.filter<Principal>(ownedNFTs, func(x:Principal) {x != nftID}); // Removing that NFT from Owned Account
                        ownersAndNFTHashMap.put(from_principal, newNFTList); // Modified NFT List by owned account

                        let newOwnerNFTs = ownersAndNFTHashMap.get(to_principal);
                        switch(newOwnerNFTs) { // Switch case for Empty NFT Array and non empty NFT Array for To_account
                            case(?newOwnerNFTs) {
                                let newOwnerNFTBuffer = Buffer.fromArray<Principal>(newOwnerNFTs); // Converting into buffer
                                newOwnerNFTBuffer.add(nftID); // Adding NFT ID
                                ownersAndNFTHashMap.put(to_principal, Buffer.toArray<Principal>(newOwnerNFTBuffer)); // Converting back into array to add it to hashmap
                                return "NFT Transferred Successfully";
                            };
                            case(null) {
                                let firstNFTForNewOwner = [nftID]; // Creating a new NFT array
                                ownersAndNFTHashMap.put(to_principal, firstNFTForNewOwner); // Adding it to hashmap
                                return "First NFT bought successfully";
                            };
                        }
                    };
                    case(null) { // When that NFT is not found
                        return "NFT not found to purchase";
                    }
                }
            };
            case(null) { // When that NFT list itself is not found
                return "No NFTs to purchase";
            }
        };
    };

    public func registerTransaction(callerID: Principal, amount: Int, time:Text): async Text {
        let transactionData: BiddingData = {
            bidderID:Principal = callerID;
            bidAmount: Nat = Int.abs(amount);
            bidTime: Text = time;
        };


        bidTransactionList := List.push<BiddingData>(transactionData, bidTransactionList);

        return "Bid request recorded successfully";
    }; 

    public query func getAllBidTransaction(): async [BiddingData] {
        let allBids = List.toArray<BiddingData>(bidTransactionList);

        return allBids;
    }

};
