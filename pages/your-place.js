import { Form, useNotification, Button } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import NftMarketplaceAbi from "../constants/NftMarketplace.json"
import { useWeb3Contract, useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import NFTBox from "../components/NFTBox"
import { useQuery, gql } from "@apollo/client"


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
        ? networkMapping[chainString].NftMarketplace[0]
        : null
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")
    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils
            .parseUnits(data.data[2].inputResult, "ether")
            .toString()
        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }
        await runContractFunction({
            params: approveOptions,
            onSuccess: (tx) =>
                handleApproveSuccess(tx, nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }
    async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
        console.log("Ok! Now time to list")
        await tx.wait()
        const listOptions = {
            abi: NftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => console.log(error),
        })
    }
    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        })
    }
    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }
    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: NftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }
    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])

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
        
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
                id="Main Form"
            />
            <div>
                Withdraw {ethers.utils.formatUnits(proceeds, "ether")} ETH
                proceeds
            </div>
            {proceeds != "0" ? (
                <Button
                    onClick={() => {
                        runContractFunction({
                            params: {
                                abi: NftMarketplaceAbi,
                                contractAddress: marketplaceAddress,
                                functionName: "withdrawProceeds",
                                params: {},
                            },
                            onError: (error) => console.log(error),
                            onSuccess: () => handleWithdrawSuccess,
                        })
                    }}
                    text="Withdraw"
                    type="button"
                />
            ) : (
                <div>No proceeds detected</div>
            )}
        </div>
    )
}
