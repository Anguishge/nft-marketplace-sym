import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import { useMoralis } from "react-moralis"
import { useQuery, gql } from "@apollo/client"
import subq from "../constants/subgraphQueries"

const inter = Inter({ subsets: ["latin"] })



export default function Home() {
    const { isWeb3Enabled, chainId, account} = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = chainId
        ? networkMapping[chainString].NftMarketplace[0]
        : null
    var GET_ITEMS = gql`
        {
            activeItems( where: {seller: "${account}"}
            ) {
                id
                buyer
                seller
                nftAddress
                tokenId
                price
            }
        }
        `
    const { loading, error, data: listedNfts } = useQuery(GET_ITEMS)
    
    console.log(listedNfts)
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Your Listings</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    !listedNfts ?(
                        <div>You don't have any active listings!</div>
                    ):
                    (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : 
                    
                    (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <div>
                                    <NFTBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                </div>
                            )
                        })
                    )
                )) : (
                    <div>Web3 Currently Not Enabled </div>
                )}
            </div>
        </div>
    )
}
