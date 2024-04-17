const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

const MINMUM_BID = 3;
const INITIAL_BID_VALUE = 10;

describe("Auction", function () {
    
    async function deployFixture() {
      
      // Contracts are deployed using the first signer/account by default
      const [beneficiary, otherAccount, otherAccount2] = await ethers.getSigners();
  
      const AuctionFacotory = await ethers.getContractFactory("Auction");
      const contract = await AuctionFacotory.deploy(MINMUM_BID, beneficiary);
  
      return { contract, beneficiary, otherAccount, otherAccount2 };
    }

    async function bidAlreadySubmittedFixture() {
        const { contract, beneficiary, otherAccount, otherAccount2} = await loadFixture(deployFixture)

        await contract.connect(otherAccount).bid( {value: INITIAL_BID_VALUE})

        return {contract, beneficiary, otherAccount, otherAccount2 }
    }

    async function auctionEndedFixture() {
        const { contract, beneficiary, otherAccount, otherAccount2} = await loadFixture(bidAlreadySubmittedFixture)

        await contract.connect(beneficiary).settleAuction()

        return {contract, beneficiary, otherAccount, otherAccount2 }
    }

    describe("Constructor - 10 points", function () {
        it("CONSTRUCTOR VALUES ARE SET PROPERLY! (+10 points)", async function () {
            const [beneficiary, otherAccount] = await ethers.getSigners();
  
            const AuctionFacotory = await ethers.getContractFactory("Auction");
            const auction = await AuctionFacotory.deploy( MINMUM_BID, beneficiary);
        
            let contractBeneficiary = await auction.beneficiary();
            let contractMinimumBid = await auction.minimumBid();

            expect(contractBeneficiary).to.equal(beneficiary);
            expect(contractMinimumBid).to.equal(MINMUM_BID);
        })
    })

    describe("Bid - 50 points", function () {
        it("PREVENTS max_bidder FROM BIDDING AGAIN (+10 points)", async function() {
            const { contract, beneficiary, otherAccount, otherAccount2} = await loadFixture(bidAlreadySubmittedFixture)
            await expect(contract.connect(otherAccount).bid( {value: INITIAL_BID_VALUE + 1})).to.be.reverted

        })
        it("BID MUST BE GREATER THAN MAX_BID (+10 points)", async function() {
            const { contract, beneficiary, otherAccount, otherAccount2} = await loadFixture(bidAlreadySubmittedFixture)
            let bid = (await contract.minimumBid()) - BigInt(1)
            await expect(contract.connect(otherAccount).bid( {value: bid})).to.be.reverted

        })
        it("NO TRANSFER WHEN BID IS CALLED FOR THE FIRST TIME. (+10 points)", async function() {
            const { contract, beneficiary, otherAccount, otherAccount2} = await loadFixture(deployFixture)

            await expect(contract.connect(otherAccount).bid({value: INITIAL_BID_VALUE})).to.changeEtherBalances(
                [contract.target, otherAccount, ethers.ZeroAddress],
                [INITIAL_BID_VALUE, -INITIAL_BID_VALUE, 0]
            );
        })
        it("SHOULD WORK IF ALL CONDITIONS ARE MET (+10 points)", async function() {
            const { contract, beneficiary, otherAccount, otherAccount2} = await loadFixture(bidAlreadySubmittedFixture)

            await expect(contract.connect(otherAccount2).bid({value: INITIAL_BID_VALUE + 1})).to.changeEtherBalances(
                [contract.target, otherAccount2, otherAccount],
                [1, -INITIAL_BID_VALUE - 1, INITIAL_BID_VALUE]
            );
        })
        it("VALUES OF MINIMUM_BID SHOULD BE UPDATED AFTER A NEW BID (+10 points)", async function() {
            const { contract, beneficiary, otherAccount, otherAccount2} = await loadFixture(bidAlreadySubmittedFixture)
            let contractMinimumBid = await contract.minimumBid()
            let contractMaxBidder = await contract.maxBidder()

            expect(contractMaxBidder).to.equal(otherAccount)
            expect(contractMinimumBid).to.equal(INITIAL_BID_VALUE)
        })
    })

    describe("settleAuction - 10 points", function() {
        it("ONLY THE BENEFICIARY CAN SETTLE AUCTION (+10 points)", async function() {
            const { contract, beneficiary, otherAccount, otherAccount2} = await loadFixture(bidAlreadySubmittedFixture)
            
            await expect(contract.connect(otherAccount).settleAuction()).to.be.reverted
        })
    })
})
