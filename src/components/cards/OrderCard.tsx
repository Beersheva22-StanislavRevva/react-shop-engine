import { Box, Button, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material"
import Product from "../../model/Product"
import { useSelectorAuth } from "../../redux/store";
import { getISODateStr } from "../../util/date-functions";
import CartItem from "../../model/CartItem";
import { AddShoppingCartOutlined, HighlightOffOutlined, InventoryOutlined, RemoveShoppingCartOutlined } from "@mui/icons-material";
import { useSelectorCart } from "../../hooks/hooks";
import Order from "../../model/Order";
type Props = {
     order: Order;
     actionFn: (isDelete: boolean) => void
}
const OrderCard: React.FC<Props> = ({ order: order, actionFn }) => {
     const userData = useSelectorAuth();
     const cartItems = useSelectorCart();
     const cartItemId: number = order.id || 0;
     const current = cartItems.filter(e => e.id == cartItemId);

     return (
          <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                    <Typography variant="h6" ml={7}>
                         id:{order.id}
                    </Typography>
                    
                    <Typography variant="h6" ml={7} >
                         sum:{order.totalSum}
                    </Typography>
                    <Typography variant="h6" ml={7} >
                         status:{order.status}
                    </Typography>
                    <Typography variant="body1" ml={7} >
                         email:{order.email} phone:{order.phone}
                    </Typography>
                    <Typography variant="body1" ml={7}>
                         adress: {order.adress}
                    </Typography>
                    <Typography variant="body1" ml={7} >
                         creation time:{order.dateTime}
                    </Typography>
               </CardContent>
               {userData && userData.role == "user" &&  
                <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '1vh', justifyContent: 'center', alignContent: 'center', marginLeft: '10vw' }}>
                    <CardActions >
                    <IconButton onClick={() => actionFn(true)}><InventoryOutlined /></IconButton>
                    <IconButton onClick={() => actionFn(false)}><HighlightOffOutlined/></IconButton>
               </CardActions>
               </Box>}
          </Card>
     );
}
export default OrderCard;