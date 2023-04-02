import { gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(
            first: 5, , where: { buyer: "0x0000000000000000000000000000000000000000" }
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
;
const GET_ALL_ITEMS = gql`
{
    activeItems(first: 5 ,
         , where: 
          {buyer_not:  
          "0x0000000000000000000000000000000000000000"
        })
    {   id
        buyer
        seller
        nftAddress
        tokenId
        price
    }
}
`;
export default {'GET_ACTIVE_ITEMS':GET_ACTIVE_ITEMS, 'GET_ALL_ITEMS':GET_ALL_ITEMS}
