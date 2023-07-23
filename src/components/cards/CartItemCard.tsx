import { Box, Button, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material"
import Product from "../../model/Product"
import { useSelectorAuth } from "../../redux/store";
import { getISODateStr } from "../../util/date-functions";
import CartItem from "../../model/CartItem";
import { AddShoppingCartOutlined, RemoveShoppingCartOutlined } from "@mui/icons-material";
import { useSelectorCart } from "../../hooks/hooks";
type Props = {
     cartItem: CartItem;
     actionFn: (isDelete: boolean) => void
}
const CartItemCard: React.FC<Props> = ({ cartItem: cartItem, actionFn }) => {
     const userData = useSelectorAuth();
     const cartItems = useSelectorCart();
     const cartItemId: number = cartItem.id || 0;
     const current = cartItems.filter(e => e.id == cartItemId);

     return (
          <Card sx={{ minWidth: 275 }}>
               <CardMedia
                    height='200'
                    component="img"
                    src={cartItem.imageLink}
                    alt="Producth"
                    sx={{ objectFit: 'contain' }}
               />
               <CardContent>
                    <Typography variant="h6" ml={7}>
                         id:{cartItem.id}
                    </Typography>
                    <Typography variant="h5" ml={7} >
                         name:{cartItem.name}
                    </Typography>
                    <Typography variant="h6" ml={7} >
                         price:{cartItems.find(el => el.id == cartItem.id)?.price}  quantity:{cartItems.find(el => el.id == cartItem.id)?.quantity} sum:{cartItems.find(el => el.id == cartItem.id)?.sum}
                    </Typography>
                    <Typography variant="h6" ml={7} >
                         category:{cartItem.category} unit:{cartItem.unit}
                    </Typography>
                    <Typography variant="body1" ml={7}>
                         description: {cartItem.description}
                    </Typography>
               </CardContent>
               {userData && userData.role == "user" &&  
                <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '1vh', justifyContent: 'center', alignContent: 'center', marginLeft: '10vw' }}>
                    <CardActions >
                    <IconButton onClick={() => actionFn(true)}><AddShoppingCartOutlined/></IconButton>
                    <IconButton onClick={() => actionFn(false)}><RemoveShoppingCartOutlined/></IconButton>
               </CardActions>
               </Box>}
          </Card>
     );
}
export default CartItemCard;