import { ConnectButton } from "web3uikit"
import Link from "next/link"
import Image from 'next/image'
export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
                                    <Image
                                        loader={() => 'https://cs5224testsrc.s3.amazonaws.com/cs5224_logo.png'}
                                        src={'https://cs5224testsrc.s3.amazonaws.com/cs5224_logo.png'}
                                        height="50"
                                        width="50"
/>
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link href="/" className="mr-4 p-6">
                    Home
                </Link>
                {/* <Link href="/sell-nft" className="mr-4 p-6">
                    Sell NFT
                </Link> */}
                <Link href="/your-place" className="mr-4 p-6">
                    Your place
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
