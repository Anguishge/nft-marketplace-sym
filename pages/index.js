import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import { useMoralis } from "react-moralis"
import { useQuery, gql } from "@apollo/client"
import subq from "../constants/subgraphQueries"
// import Table from '../components/Table';
import {Table} from '@nextui-org/react'
const inter = Inter({ subsets: ["latin"] })

const columns = [
    {
      key: "price",
      label: "Price",
    },
    {
      key: "seller",
      label: "Seller",
    },
    {
      key: "buyer",
      label: "Buyer",
    },
    {
        key: "nftAddress",
        label: "NFTAddress",
      },
  ];
  
  ;






export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "5"
    console.log(chainString)
    const marketplaceAddress = chainId
        ? networkMapping[chainString].NftMarketplace[0]
        : null

    const { loading, error, data: listedNfts } = useQuery(subq.GET_ACTIVE_ITEMS)
    const { loading_, error_, data: PastNfts } = useQuery(subq.GET_ALL_ITEMS)
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller} = nft
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
                ) : (
                    <div>Web3 Currently Not Enabled </div>
                )}
            </div>
            <h1 className="py-4 px-4 font-bold text-2xl">Past transactions</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !PastNfts ? (
                        <div>Loading...</div>
                    ) : (
                        PastNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller,buyer } = nft
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
                        }
                        
                        
                        
                        
                        )
                    )
                ) : (
                    <div>Web3 Currently Not Enabled </div>
                )}
            </div>
            <h1 className="py-4 px-4 font-bold text-2xl">Past transactions</h1>
            <div className="flex flex-wrap">
            
                    <Table
                    aria-label="Example table with dynamic content"
                    css={{
                        height: "auto",
                        minWidth: "100%",
                    }}
                    >
                    <Table.Header columns={columns}>
                        {(column) => (
                        <Table.Column key={column.key}>{column.label}</Table.Column>
                        )}
                    </Table.Header>
                    <Table.Body items={PastNfts.activeItems}>
                        {(item) => (
                        <Table.Row key={item.key}>
                            {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
                        </Table.Row>
                        )}
                    </Table.Body>
                    </Table>
                ;
            
            </div>


        </div>
    )
}
