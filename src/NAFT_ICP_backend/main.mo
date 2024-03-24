import NFTClass "./NFT/NFT";
import Principal "mo:base/Principal";

actor naft_icp {
    public func greet() : async Text {
        
        return "Hello,  !";

    };

    public func greetNFT(name : Text) : async Text {
        let nftMint = await NFTClass.NFT(name);

        let nftName = await nftMint.getNFTParams();
        let nftID = Principal.toText(await nftMint.getNFTId());
        
        return "NFT Name: " # nftName # "\nNFT Principal ID: " # nftID # "";

    };

    public shared(msg) func whoIsCalling(): async Text {
        return Principal.toText(msg.caller);
    }
};
