import AssetActor "./Asset/Asset";
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

    private type AssetData = {
        assetType: Text;
        assetName: Text;
        assetDesc: Text;
        assetPrice: Nat;
        assetTags: Text;
        assetToken: Nat;
        dataString: Text;
    };

    private type OwnerInventory = {
        nftAssets: [Principal];
        textAssets: [Principal];
        audioAssets: [Principal];
        videoAssets: [Principal];
    };

    private type AuctionData = {
        assetID: Principal;
        startingPrice: Nat;
        totalHours: Nat;
        docType: Text;
        auctionStatus: Text;
    };

    private type BiddingData = {
        bidderID: Principal;
        bidAmount: Nat;
        bidTime: Text;
    };

    //stable var mintedNFTs = List.nil<Principal>();
    private stable var _assetIDAndassetDataList : [(Principal, AssetData)] = [];
    private stable var _ownerIDAndInventoryList: [(Principal, OwnerInventory)] = []; // For normal buy, sell
    private stable var _auctionOwnersAndInventoryList: [(Principal, OwnerInventory)] = []; // For Auctioned Assets
    private stable var _assetIDWithAuctionDetailsList: [(Principal, AuctionData)] = []; // Auction Asset ID and auction details
    private stable var _auctionAssetIDwithAssetDataList: [(Principal, AssetData)] = []; // Auction Asset ID and Asset details
    // Auction Asset ID and bids of it
    private stable var _auctionAssetIDwithBidTransactionList: [(Principal, BiddingData)] = [];
    private stable var bidTransactionList = List.nil<BiddingData>();

    // Asset ID with Asset Data
    var assetIDWithAssetDataHashMap : HashMap.HashMap<Principal, AssetData> = HashMap.fromIter(_assetIDAndassetDataList.vals(), 0, Principal.equal, Principal.hash);
    // Owner ID with only Asset ID
    var ownerIDAndInventoryHashMap: HashMap.HashMap<Principal, OwnerInventory> = HashMap.fromIter(_ownerIDAndInventoryList.vals(), 0, Principal.equal, Principal.hash);
    
    // Auction Owner with list of NFT IDs
    var auctionOwnersAndInventoryHashMap: HashMap.HashMap<Principal, OwnerInventory> = HashMap.fromIter(_auctionOwnersAndInventoryList.vals(), 0, Principal.equal, Principal.hash);
    // NFT ID with Auction Data
    var assetIDWithAuctionDetailsHashMap: HashMap.HashMap<Principal, AuctionData> = HashMap.fromIter(_assetIDWithAuctionDetailsList.vals(), 0, Principal.equal, Principal.hash);
    // Auction Asset ID with Asset Data
    var auctionAssetIDwithAssetDataHashMap: HashMap.HashMap<Principal, AssetData> = HashMap.fromIter(_auctionAssetIDwithAssetDataList.vals(), 0, Principal.equal, Principal.hash);
    // Auction Asset ID with Bid Transaction Data
    var auctionAssetIDwithBidTransactionHashMap: HashMap.HashMap<Principal, BiddingData> = HashMap.fromIter(_auctionAssetIDwithBidTransactionList.vals(), 0, Principal.equal, Principal.hash);

    system func preupgrade() {
        _assetIDAndassetDataList := Iter.toArray(assetIDWithAssetDataHashMap.entries());
        _ownerIDAndInventoryList := Iter.toArray(ownerIDAndInventoryHashMap.entries());
        _auctionOwnersAndInventoryList := Iter.toArray(auctionOwnersAndInventoryHashMap.entries());
        _assetIDWithAuctionDetailsList := Iter.toArray(assetIDWithAuctionDetailsHashMap.entries());
        _auctionAssetIDwithAssetDataList := Iter.toArray(auctionAssetIDwithAssetDataHashMap.entries());
        _auctionAssetIDwithBidTransactionList := Iter.toArray(auctionAssetIDwithBidTransactionHashMap.entries());
    };

    system func postupgrade() {
        _assetIDAndassetDataList := [];
        _ownerIDAndInventoryList := [];
        _auctionOwnersAndInventoryList := [];
        _assetIDWithAuctionDetailsList := [];
        _auctionAssetIDwithAssetDataList := [];
        _auctionAssetIDwithBidTransactionList := [];
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

    public shared(msg) func mintAsset(asset_type: Text,tags:Text,name: Text, desc: Text, price: Int, token: Int, imageData:Text, minter: Principal, auctionMint: Bool, startingAmount: Int, auctionHours: Int): async Principal {
    
      let obtainedAsset: AssetData = {
        assetType = asset_type;
        assetName = name;
        assetDesc = desc;
        assetPrice = Int.abs(price);
        assetToken = Int.abs(token);
        dataString = imageData;
        assetTags = tags;
      };

        Cycles.add(300_000_000_000);

    Debug.print("Cycles updated "# Nat.toText(Cycles.balance()));

      let newAsset = await AssetActor.Asset(asset_type,name, desc, Int.abs(price),tags, Int.abs(token), imageData);

    Debug.print("New Cycles "# Nat.toText(Cycles.balance()));
      
      let assetID = await newAsset.getAssetId();
      
      // If the asset is not for Auction
      if(auctionMint == false) {
        // Map asset data with asset ID
      assetIDWithAssetDataHashMap.put(assetID, obtainedAsset);
      // Fetching the inventory of Owner
      var minterInventory = ownerIDAndInventoryHashMap.get(minter);
      
      // Checking the Owner's Inventory
      switch(minterInventory) {
        case(?minterInventory) {
            if(asset_type == "NFT") {
            var minterNFTs = minterInventory.nftAssets; // Obtaining NFT Assets
            var nftBuffer = Buffer.fromArray<Principal>(minterNFTs); // Converting it into Buffer
            nftBuffer.add(assetID); // Add new Asset ID to it
            // Create new Owner Inventory with modified NFT List
            var newInventory:OwnerInventory = {
                nftAssets:[Principal] = Buffer.toArray<Principal>(nftBuffer);
                audioAssets:[Principal] = minterInventory.audioAssets;
                videoAssets:[Principal] = minterInventory.videoAssets;
                textAssets:[Principal] = minterInventory.textAssets;
            };
            ownerIDAndInventoryHashMap.put(minter, newInventory); // Updating the HashMap
            } 
            
            else if(asset_type == "Audio") {
                var minterAudios = minterInventory.audioAssets; // Obtaining Audio Assets
            var audioBuffer = Buffer.fromArray<Principal>(minterAudios); // Converting it into Buffer
            audioBuffer.add(assetID); // Add new Asset ID to it
            // Create new Owner Inventory with modified Audio List
            var newInventory:OwnerInventory = {
                nftAssets:[Principal] = minterInventory.nftAssets;
                audioAssets:[Principal] = Buffer.toArray<Principal>(audioBuffer);
                videoAssets:[Principal] = minterInventory.videoAssets;
                textAssets:[Principal] = minterInventory.textAssets;
            };
            ownerIDAndInventoryHashMap.put(minter, newInventory); // Updating the HashMap
            } 
            
            else if(asset_type == "Video") {
                            var minterVideos = minterInventory.videoAssets; // Obtaining Video Assets
            var videoBuffer = Buffer.fromArray<Principal>(minterVideos); // Converting it into Buffer
            videoBuffer.add(assetID); // Add new Asset ID to it
            // Create new Owner Inventory with modified Video List
            var newInventory:OwnerInventory = {
                nftAssets:[Principal] = minterInventory.nftAssets;
                audioAssets:[Principal] = minterInventory.audioAssets;
                videoAssets:[Principal] = Buffer.toArray<Principal>(videoBuffer);
                textAssets:[Principal] = minterInventory.textAssets;
            };
            ownerIDAndInventoryHashMap.put(minter, newInventory); // Updating the HashMap
            } 
            
            
            else if(asset_type == "Text") {
                            var minterTexts = minterInventory.textAssets; // Obtaining NFT Assets
            var textBuffer = Buffer.fromArray<Principal>(minterTexts); // Converting it into Buffer
            textBuffer.add(assetID); // Add new Asset ID to it
            // Create new Owner Inventory with modified NFT List
            var newInventory:OwnerInventory = {
                nftAssets:[Principal] = minterInventory.nftAssets;
                audioAssets:[Principal] = minterInventory.audioAssets;
                videoAssets:[Principal] = minterInventory.videoAssets;
                textAssets:[Principal] = Buffer.toArray<Principal>(textBuffer);
            };
            ownerIDAndInventoryHashMap.put(minter, newInventory); // Updating the HashMap
            } 
            
            
            else {

            };
        };
        case null {  
            if(asset_type == "NFT") {
            // If NFT is the first thing they mint
            let newOwnerInventory: OwnerInventory = {
                nftAssets:[Principal] = [assetID];
                audioAssets:[Principal] = [];
                textAssets:[Principal] = [];
                videoAssets:[Principal] = [];
            };
            ownerIDAndInventoryHashMap.put(minter, newOwnerInventory); // Updating the HashMap

            } else if(asset_type == "Audio") {
            // If Audio is the first thing they mint
            let newOwnerInventory: OwnerInventory = {
                nftAssets:[Principal] = [];
                audioAssets:[Principal] = [assetID];
                textAssets:[Principal] = [];
                videoAssets:[Principal] = [];
            };
            ownerIDAndInventoryHashMap.put(minter, newOwnerInventory); // Updating the HashMap

            } else if(asset_type == "Text") {
            // If Text is the first thing they mint
            let newOwnerInventory: OwnerInventory = {
                nftAssets:[Principal] = [];
                audioAssets:[Principal] = [];
                textAssets:[Principal] = [assetID];
                videoAssets:[Principal] = [];
            };
            ownerIDAndInventoryHashMap.put(minter, newOwnerInventory); // Updating the HashMap

            } else if(asset_type == "Video") {
            // If Video is the first thing they mint
            let newOwnerInventory: OwnerInventory = {
                nftAssets:[Principal] = [];
                audioAssets:[Principal] = [];
                textAssets:[Principal] = [];
                videoAssets:[Principal] = [assetID];
            };
            ownerIDAndInventoryHashMap.put(minter, newOwnerInventory); // Updating the HashMap
            } else {

            };

        }
      };

      /*switch(minterInventory) { // Check for any existence of previous assets
        case null {
            ownersAndNFTHashMap.put(minter, [nftID]);
        };

        case(?prevBoughtNFTList) {
            let availableNFTs = Buffer.fromArray<Principal>(prevBoughtNFTList);
            availableNFTs.add(nftID);
            ownersAndNFTHashMap.put(minter, Buffer.toArray<Principal>(availableNFTs));
        }

      };*/

      return assetID; } 
      
      else {
        // If it is for Auction
        let auctionDetails: AuctionData = {
                    assetID: Principal = assetID;
                    startingPrice: Nat = Int.abs(startingAmount);
                    totalHours: Nat = Int.abs(auctionHours);
                    docType: Text = asset_type;
                    auctionStatus: Text = "Ongoing";
                };
        assetIDWithAuctionDetailsHashMap.put(assetID, auctionDetails); // Map Auction Asset ID with Auction details
        auctionAssetIDwithAssetDataHashMap.put(assetID, obtainedAsset); // Map Auction Asset ID with Asset data details
        var minterAuctionInventory = auctionOwnersAndInventoryHashMap.get(minter);
        // Check auction inventory of Minter
        switch(minterAuctionInventory) {
            case(?minterAuctionInventory) {
                if(asset_type == "NFT") {
                    let minterAuctionNFTs = minterAuctionInventory.nftAssets;
                    let nftAuctionBuffer = Buffer.fromArray<Principal>(minterAuctionNFTs);
                    nftAuctionBuffer.add(assetID);
                    var newAuctionInventory: OwnerInventory = {
                        nftAssets:[Principal] = Buffer.toArray<Principal>(nftAuctionBuffer);
                        audioAssets:[Principal] = minterAuctionInventory.audioAssets;
                        textAssets:[Principal] = minterAuctionInventory.textAssets;
                        videoAssets:[Principal] = minterAuctionInventory.videoAssets;
                    };
                    auctionOwnersAndInventoryHashMap.put(minter, newAuctionInventory);
                }

                else if(asset_type == "Audio") {
                                        let minterAuctionAudios = minterAuctionInventory.audioAssets;
                    let audioAuctionBuffer = Buffer.fromArray<Principal>(minterAuctionAudios);
                    audioAuctionBuffer.add(assetID);
                    var newAuctionInventory: OwnerInventory = {
                        nftAssets:[Principal] = minterAuctionInventory.nftAssets;
                        audioAssets:[Principal] = Buffer.toArray<Principal>(audioAuctionBuffer);
                        textAssets:[Principal] = minterAuctionInventory.textAssets;
                        videoAssets:[Principal] = minterAuctionInventory.videoAssets;
                    };
                    auctionOwnersAndInventoryHashMap.put(minter, newAuctionInventory);
                }

                else if(asset_type == "Video") {
                                        let minterAuctionVideos = minterAuctionInventory.videoAssets;
                    let videosAuctionBuffer = Buffer.fromArray<Principal>(minterAuctionVideos);
                    videosAuctionBuffer.add(assetID);
                    var newAuctionInventory: OwnerInventory = {
                        nftAssets:[Principal] = minterAuctionInventory.nftAssets;
                        audioAssets:[Principal] = minterAuctionInventory.audioAssets;
                        textAssets:[Principal] = minterAuctionInventory.textAssets;
                        videoAssets:[Principal] = Buffer.toArray<Principal>(videosAuctionBuffer);
                    };
                    auctionOwnersAndInventoryHashMap.put(minter, newAuctionInventory);
                }

                else if(asset_type == "Text") {
                                        let minterAuctionTexts = minterAuctionInventory.textAssets;
                    let textAuctionBuffer = Buffer.fromArray<Principal>(minterAuctionTexts);
                    textAuctionBuffer.add(assetID);
                    var newAuctionInventory: OwnerInventory = {
                        nftAssets:[Principal] = minterAuctionInventory.nftAssets;
                        audioAssets:[Principal] = minterAuctionInventory.audioAssets;
                        textAssets:[Principal] = Buffer.toArray<Principal>(textAuctionBuffer);
                        videoAssets:[Principal] = minterAuctionInventory.videoAssets;
                    };
                    auctionOwnersAndInventoryHashMap.put(minter, newAuctionInventory);
                } else {

                };

                return assetID;
            }; case(null) {
                if(asset_type == "NFT") {
                    let firstAuctionInventory: OwnerInventory = {
                        nftAssets:[Principal] = [assetID];
                        audioAssets:[Principal] = [];
                        textAssets:[Principal] = [];
                        videoAssets:[Principal] = [];
                    };
                    auctionOwnersAndInventoryHashMap.put(minter, firstAuctionInventory);
                

                } else if(asset_type == "Audio") {

                    let firstAuctionInventory: OwnerInventory = {
                        nftAssets:[Principal] = [];
                        audioAssets:[Principal] = [assetID];
                        textAssets:[Principal] = [];
                        videoAssets:[Principal] = [];
                    };
                    auctionOwnersAndInventoryHashMap.put(minter, firstAuctionInventory);
                

                } else if(asset_type == "Video") {
                        let firstAuctionInventory: OwnerInventory = {
                        nftAssets:[Principal] = [];
                        audioAssets:[Principal] = [];
                        textAssets:[Principal] = [];
                        videoAssets:[Principal] = [assetID];
                    };
                    auctionOwnersAndInventoryHashMap.put(minter, firstAuctionInventory);
                

                } else if(asset_type == "Text") {
                            let firstAuctionInventory: OwnerInventory = {
                        nftAssets:[Principal] = [];
                        audioAssets:[Principal] = [];
                        textAssets:[Principal] = [assetID];
                        videoAssets:[Principal] = [];
                    };
                    auctionOwnersAndInventoryHashMap.put(minter, firstAuctionInventory);
                
                } else {

                };
                return assetID;

            }
        }
      }  
    };

    public query func getAllNFTs(): async[(Principal, [Principal])] {
        let allMinters = ownerIDAndInventoryHashMap.keys();
        let ownersAndNFTBuffers = Buffer.Buffer<(Principal, [Principal])>(1);
        for(minter in allMinters) {
            let nftList = ownerIDAndInventoryHashMap.get(minter);
            switch(nftList) {
                case(?nftList) {
                    ownersAndNFTBuffers.add((minter, nftList.nftAssets ));
                };
                case(null) {
                    ownersAndNFTBuffers.add((minter, []));
                }
            }

        };
        return Buffer.toArray<(Principal, [Principal])>(ownersAndNFTBuffers);
    };

    public query func getAllTexts(): async[(Principal, [Principal])] {
        let allMinters = ownerIDAndInventoryHashMap.keys();
        let ownersAndTextBuffers = Buffer.Buffer<(Principal, [Principal])>(1);
        for(minter in allMinters) {
            let textList = ownerIDAndInventoryHashMap.get(minter);
            switch(textList) {
                case(?textList) {
                    ownersAndTextBuffers.add((minter, textList.textAssets ));
                };
                case(null) {
                    ownersAndTextBuffers.add((minter, []));
                }
            }

        };
        return Buffer.toArray<(Principal, [Principal])>(ownersAndTextBuffers);
    };

    public query func getAllAudios(): async[(Principal, [Principal])] {
        let allMinters = ownerIDAndInventoryHashMap.keys();
        let ownersAndAudioBuffers = Buffer.Buffer<(Principal, [Principal])>(1);
        for(minter in allMinters) {
            let audioList = ownerIDAndInventoryHashMap.get(minter);
            switch(audioList) {
                case(?audioList) {
                    ownersAndAudioBuffers.add((minter, audioList.audioAssets ));
                };
                case(null) {
                    ownersAndAudioBuffers.add((minter, []));
                }
            }

        };
        return Buffer.toArray<(Principal, [Principal])>(ownersAndAudioBuffers);
    };

        public query func getAllVideos(): async[(Principal, [Principal])] {
        let allMinters = ownerIDAndInventoryHashMap.keys();
        let ownersAndVideoBuffers = Buffer.Buffer<(Principal, [Principal])>(1);
        for(minter in allMinters) {
            let videoList = ownerIDAndInventoryHashMap.get(minter);
            switch(videoList) {
                case(?videoList) {
                    ownersAndVideoBuffers.add((minter, videoList.videoAssets ));
                };
                case(null) {
                    ownersAndVideoBuffers.add((minter, []));
                }
            }

        };
        return Buffer.toArray<(Principal, [Principal])>(ownersAndVideoBuffers);
    };


    public query func getAllAuctionNFTs(): async [Principal] {
        let allAuctionMinters = auctionOwnersAndInventoryHashMap.keys();
        let auctionBuffers = Buffer.Buffer<Principal>(1);
        for(minter in allAuctionMinters) {
            let auctionNFTList = auctionOwnersAndInventoryHashMap.get(minter);
            switch(auctionNFTList) {
                case(?auctionNFTList) {
                    for(auctionNFT in auctionNFTList.nftAssets.vals()) {
                    auctionBuffers.add(auctionNFT);
                    }
                }; case(null) {
                }
            }
        };
        return Buffer.toArray<Principal>(auctionBuffers);
    };

    public query func getAllAuctionTexts(): async [Principal] {
        let allAuctionMinters = auctionOwnersAndInventoryHashMap.keys();
        let auctionBuffers = Buffer.Buffer<Principal>(1);
        for(minter in allAuctionMinters) {
            let auctionNFTList = auctionOwnersAndInventoryHashMap.get(minter);
            switch(auctionNFTList) {
                case(?auctionNFTList) {
                    for(auctionNFT in auctionNFTList.textAssets.vals()) {
                    auctionBuffers.add(auctionNFT);
                    }
                }; case(null) {
                }
            }
        };
        return Buffer.toArray<Principal>(auctionBuffers);
    };

    public query func getAllAuctionAudios(): async [Principal] {
        let allAuctionMinters = auctionOwnersAndInventoryHashMap.keys();
        let auctionBuffers = Buffer.Buffer<Principal>(1);
        for(minter in allAuctionMinters) {
            let auctionNFTList = auctionOwnersAndInventoryHashMap.get(minter);
            switch(auctionNFTList) {
                case(?auctionNFTList) {
                    for(auctionNFT in auctionNFTList.audioAssets.vals()) {
                    auctionBuffers.add(auctionNFT);
                    }
                }; case(null) {
                }
            }
        };
        return Buffer.toArray<Principal>(auctionBuffers);
    };

        public query func getAllAuctionVideos(): async [Principal] {
        let allAuctionMinters = auctionOwnersAndInventoryHashMap.keys();
        let auctionBuffers = Buffer.Buffer<Principal>(1);
        for(minter in allAuctionMinters) {
            let auctionNFTList = auctionOwnersAndInventoryHashMap.get(minter);
            switch(auctionNFTList) {
                case(?auctionNFTList) {
                    for(auctionNFT in auctionNFTList.videoAssets.vals()) {
                    auctionBuffers.add(auctionNFT);
                    }
                }; case(null) {
                }
            }
        };
        return Buffer.toArray<Principal>(auctionBuffers);
    };

    public query func getAssetData(assetID: Principal):async AssetData {
        let assetData = assetIDWithAssetDataHashMap.get(assetID);
        switch(assetData) {
            case(?assetData) {
                return assetData;
            };
             case(null) {
                let dummyAsset: AssetData = {
                    assetName = "";
                    assetDesc = "";
                    assetPrice = 1;
                    assetToken = 1;
                    assetTags = "";
                    assetType = "";
                    dataString = "";
                };
                return dummyAsset;
            }
        }
    };

    public query func getAuctionAssetData(assetID: Principal):async AssetData {
        let assetData = auctionAssetIDwithAssetDataHashMap.get(assetID);
        switch(assetData) {
            case(?assetData) {
                return assetData;
            };
             case(null) {
                let dummyAsset: AssetData = {
                    assetName = "";
                    assetDesc = "";
                    assetPrice = 1;
                    assetToken = 1;
                    assetTags = "";
                    assetType = "";
                    dataString = "";
                };
                return dummyAsset;
            }
        }
    };

    public query func getYourNFTs(princID: Principal): async [Principal] {
        let allNFTs = ownerIDAndInventoryHashMap.get(princID);

        switch(allNFTs) {
            case(?allNFTs) {
                return allNFTs.nftAssets;
            };

            case(null) {
                return [];
            }
        };
    };

    public query func getNFTOwner(nftID: Principal): async Text {
        for (key in ownerIDAndInventoryHashMap.keys()) {
            let ownerNFTs = ownerIDAndInventoryHashMap.get(key);
            switch(ownerNFTs) {
                case(?ownerNFTs) {
                    let isFound = Array.find<Principal>(ownerNFTs.nftAssets, func(x:Principal) {x == nftID});
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

    public query func getTextOwner(textID: Principal): async Text {
        for (key in ownerIDAndInventoryHashMap.keys()) {
            let ownerTexts = ownerIDAndInventoryHashMap.get(key);
            switch(ownerTexts) {
                case(?ownerTexts) {
                    let isFound = Array.find<Principal>(ownerTexts.textAssets, func(x:Principal) {x == textID});
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

    public query func getAudioOwner(audioID: Principal): async Text {
        for (key in ownerIDAndInventoryHashMap.keys()) {
            let ownerAudios = ownerIDAndInventoryHashMap.get(key);
            switch(ownerAudios) {
                case(?ownerAudios) {
                    let isFound = Array.find<Principal>(ownerAudios.audioAssets, func(x:Principal) {x == audioID});
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

    public query func getVideoOwner(videoID: Principal): async Text {
        for (key in ownerIDAndInventoryHashMap.keys()) {
            let ownerVideos = ownerIDAndInventoryHashMap.get(key);
            switch(ownerVideos) {
                case(?ownerVideos) {
                    let isFound = Array.find<Principal>(ownerVideos.videoAssets, func(x:Principal) {x == videoID});
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

    public query func getAuctionConductorinNFT(nftID: Principal): async Text {
        for (key in auctionOwnersAndInventoryHashMap.keys()) {
            let ownerNFTs = auctionOwnersAndInventoryHashMap.get(key);
            switch(ownerNFTs) {
                case(?ownerNFTs) {
                    let isFound = Array.find<Principal>(ownerNFTs.nftAssets, func(x:Principal) {x == nftID});
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

    public query func getAuctionConductorinText(textID: Principal): async Text {
        for (key in auctionOwnersAndInventoryHashMap.keys()) {
            let ownerTexts = auctionOwnersAndInventoryHashMap.get(key);
            switch(ownerTexts) {
                case(?ownerTexts) {
                    let isFound = Array.find<Principal>(ownerTexts.textAssets, func(x:Principal) {x == textID});
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

    public query func getAuctionConductorinAudio(audioID: Principal): async Text {
        for (key in auctionOwnersAndInventoryHashMap.keys()) {
            let ownerAudios = auctionOwnersAndInventoryHashMap.get(key);
            switch(ownerAudios) {
                case(?ownerAudios) {
                    let isFound = Array.find<Principal>(ownerAudios.audioAssets, func(x:Principal) {x == audioID});
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

    public query func getAuctionConductorinVideos(videoID: Principal): async Text {
        for (key in auctionOwnersAndInventoryHashMap.keys()) {
            let ownerVideos = auctionOwnersAndInventoryHashMap.get(key);
            switch(ownerVideos) {
                case(?ownerVideos) {
                    let isFound = Array.find<Principal>(ownerVideos.videoAssets, func(x:Principal) {x == videoID});
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

    public func transferAsset(nftID: Principal,from_principal: Principal, to_principal: Principal, asset_type: Text): async Text {
        let ownedAssets = ownerIDAndInventoryHashMap.get(from_principal);
        switch(ownedAssets) {
            case(?ownedAssets) {
                if(asset_type == "NFT") {
                    let found = Array.find<Principal>(ownedAssets.nftAssets, func(x:Principal) {x == nftID});
                switch(found) {
                    case(?found) {
                        let newNFTList = Array.filter<Principal>(ownedAssets.nftAssets, func(x:Principal) {x != nftID}); // Removing that NFT from Owned Account
                        let modifiedAssets: OwnerInventory = {
                            nftAssets = newNFTList;
                            audioAssets = ownedAssets.audioAssets;
                            videoAssets = ownedAssets.videoAssets;
                            textAssets = ownedAssets.textAssets;
                        };
                        
                        ownerIDAndInventoryHashMap.put(from_principal, modifiedAssets); // Modified NFT List by owned account

                        let newOwnerAssets = ownerIDAndInventoryHashMap.get(to_principal);
                        switch(newOwnerAssets) { // Switch case for Empty NFT Array and non empty NFT Array for To_account
                            case(?newOwnerAssets) {
                                let newOwnerNFTBuffer = Buffer.fromArray<Principal>(newOwnerAssets.nftAssets); // Converting into buffer
                                newOwnerNFTBuffer.add(nftID); // Adding NFT ID
                                let modifiedNewAssets: OwnerInventory = {
                            nftAssets= Buffer.toArray<Principal>(newOwnerNFTBuffer);
                            audioAssets = ownedAssets.audioAssets;
                            videoAssets =  ownedAssets.videoAssets;
                            textAssets = ownedAssets.textAssets;
                        };
                                ownerIDAndInventoryHashMap.put(to_principal, modifiedNewAssets); // Converting back into array to add it to hashmap
                                return "NFT Transferred Successfully";
                            };
                            case(null) {
                                let firstNFTForNewOwner = [nftID]; // Creating a new NFT array
                                let modifiedFirstAsset: OwnerInventory = {
                                    nftAssets = firstNFTForNewOwner;
                                    audioAssets = [];
                                    videoAssets = [];
                                    textAssets =[];
                                };
                                ownerIDAndInventoryHashMap.put(to_principal, modifiedFirstAsset); // Adding it to hashmap
                                return "First NFT asset bought successfully";
                            };
                        }
                    };
                    case(null) { // When that NFT is not found
                        return "NFT not found to purchase";
                    }
                }
                } else if(asset_type == "Text") {
                    
                    let found = Array.find<Principal>(ownedAssets.textAssets, func(x:Principal) {x == nftID});
                switch(found) {
                    case(?found) {
                        let newTextList = Array.filter<Principal>(ownedAssets.textAssets, func(x:Principal) {x != nftID}); // Removing that NFT from Owned Account
                        let modifiedAssets: OwnerInventory = {
                            nftAssets = ownedAssets.nftAssets;
                            audioAssets = ownedAssets.audioAssets;
                            videoAssets = ownedAssets.videoAssets;
                            textAssets = newTextList;
                        };
                        
                        ownerIDAndInventoryHashMap.put(from_principal, modifiedAssets); // Modified NFT List by owned account

                        let newOwnerAssets = ownerIDAndInventoryHashMap.get(to_principal);
                        switch(newOwnerAssets) { // Switch case for Empty NFT Array and non empty NFT Array for To_account
                            case(?newOwnerAssets) {
                                let newOwnerTextBuffer = Buffer.fromArray<Principal>(newOwnerAssets.textAssets); // Converting into buffer
                                newOwnerTextBuffer.add(nftID); // Adding NFT ID
                                let modifiedNewAssets: OwnerInventory = {
                            nftAssets = ownedAssets.nftAssets;
                            audioAssets = ownedAssets.audioAssets;
                            videoAssets = ownedAssets.videoAssets;
                            textAssets = Buffer.toArray<Principal>(newOwnerTextBuffer);
                        };
                                ownerIDAndInventoryHashMap.put(to_principal, modifiedNewAssets); // Converting back into array to add it to hashmap
                                return "Text Document Transferred Successfully";
                            };
                            case(null) {
                                let firstTextForNewOwner = [nftID]; // Creating a new NFT array
                                let modifiedFirstAsset: OwnerInventory = {
                                    nftAssets = [];
                                    audioAssets = [];
                                    videoAssets = [];
                                    textAssets = firstTextForNewOwner;
                                };
                                ownerIDAndInventoryHashMap.put(to_principal, modifiedFirstAsset); // Adding it to hashmap
                                return "First Text asset bought successfully";
                            };
                        }
                    };
                    case(null) { // When that NFT is not found
                        return "Text Asset not found to purchase";
                    }
                }


                } else if(asset_type == "Audio") {

                    let found = Array.find<Principal>(ownedAssets.audioAssets, func(x:Principal) {x == nftID});
                switch(found) {
                    case(?found) {
                        let newAudioList = Array.filter<Principal>(ownedAssets.audioAssets, func(x:Principal) {x != nftID}); // Removing that NFT from Owned Account
                        let modifiedAssets: OwnerInventory = {
                            nftAssets = ownedAssets.nftAssets;
                            audioAssets = newAudioList;
                            videoAssets = ownedAssets.videoAssets;
                            textAssets = ownedAssets.textAssets;
                        };
                        
                        ownerIDAndInventoryHashMap.put(from_principal, modifiedAssets); // Modified NFT List by owned account

                        let newOwnerAssets = ownerIDAndInventoryHashMap.get(to_principal);
                        switch(newOwnerAssets) { // Switch case for Empty NFT Array and non empty NFT Array for To_account
                            case(?newOwnerAssets) {
                                let newOwnerAudioBuffer = Buffer.fromArray<Principal>(newOwnerAssets.audioAssets); // Converting into buffer
                                newOwnerAudioBuffer.add(nftID); // Adding NFT ID
                                let modifiedNewAssets: OwnerInventory = {
                            nftAssets = ownedAssets.nftAssets;
                            audioAssets = Buffer.toArray<Principal>(newOwnerAudioBuffer);
                            videoAssets = ownedAssets.videoAssets;
                            textAssets = ownedAssets.textAssets;
                        };
                                ownerIDAndInventoryHashMap.put(to_principal, modifiedNewAssets); // Converting back into array to add it to hashmap
                                return "Audio asset Transferred Successfully";
                            };
                            case(null) {
                                let firstAudioForNewOwner = [nftID]; // Creating a new NFT array
                                let modifiedFirstAsset: OwnerInventory = {
                                    nftAssets =[];
                                    audioAssets = firstAudioForNewOwner;
                                    videoAssets = [];
                                    textAssets =[];
                                };
                                ownerIDAndInventoryHashMap.put(to_principal, modifiedFirstAsset); // Adding it to hashmap
                                return "First Audio asset bought successfully";
                            };
                        }
                    };
                    case(null) { // When that NFT is not found
                        return "Audio not found to purchase";
                    }
                }


                } else if(asset_type == "Video") {
                    let found = Array.find<Principal>(ownedAssets.videoAssets, func(x:Principal) {x == nftID});
                switch(found) {
                    case(?found) {
                        let newVideoList = Array.filter<Principal>(ownedAssets.videoAssets, func(x:Principal) {x != nftID}); // Removing that NFT from Owned Account
                        let modifiedAssets: OwnerInventory = {
                            nftAssets = ownedAssets.nftAssets;
                            audioAssets = ownedAssets.audioAssets;
                            videoAssets = newVideoList;
                            textAssets = ownedAssets.textAssets;
                        };
                        
                        ownerIDAndInventoryHashMap.put(from_principal, modifiedAssets); // Modified NFT List by owned account

                        let newOwnerAssets = ownerIDAndInventoryHashMap.get(to_principal);
                        switch(newOwnerAssets) { // Switch case for Empty NFT Array and non empty NFT Array for To_account
                            case(?newOwnerAssets) {
                                let newOwnerVideoBuffer = Buffer.fromArray<Principal>(newOwnerAssets.videoAssets); // Converting into buffer
                                newOwnerVideoBuffer.add(nftID); // Adding NFT ID
                                let modifiedNewAssets: OwnerInventory = {
                            nftAssets = ownedAssets.nftAssets;
                            audioAssets =ownedAssets.audioAssets;
                            videoAssets = Buffer.toArray<Principal>(newOwnerVideoBuffer);
                            textAssets = ownedAssets.textAssets;
                        };
                                ownerIDAndInventoryHashMap.put(to_principal, modifiedNewAssets); // Converting back into array to add it to hashmap
                                return "Video Transferred Successfully";
                            };
                            case(null) {
                                let firstVideoForNewOwner = [nftID]; // Creating a new NFT array
                                let modifiedFirstAsset: OwnerInventory = {
                                    nftAssets = [];
                                    audioAssets = [];
                                    videoAssets = firstVideoForNewOwner;
                                    textAssets =[];
                                };
                                ownerIDAndInventoryHashMap.put(to_principal, modifiedFirstAsset); // Adding it to hashmap
                                return "First Video asset bought successfully";
                            };
                        }
                    };
                    case(null) { // When that NFT is not found
                        return "Video not found to purchase";
                    }
                }

                } else {
                    return "Invalid asset type";
                }
            };
            case(null) { // When that NFT list itself is not found
                return "No NFTs to purchase";
            }
        };
    };


    /*
    public query func fetchAllAuctionDetails(): async [AuctionData] {
        let allAuctionDetails = Iter.toArray(nftWithAuctionDetailsHashMap.vals());
        return allAuctionDetails;
    };

    public query func fetchAllAuctionAssets(): async [Principal] {
        let allAuctionAssetPrincipals = Iter.toArray(nftWithAuctionDetailsHashMap.keys());
        return allAuctionAssetPrincipals;
    };

    public query func getAllNFTs():async [(Principal, AssetData)] {
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

    */

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
