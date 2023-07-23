import { Box,  Button,  Grid,  IconButton,  Modal, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import Product from "../../model/Product";
import { productService, ordersService } from "../../config/service-config";
import { Subscription } from 'rxjs';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { DeleteOutline, AddCircleOutline, RemoveCircleOutline, Details, Edit, Man, Visibility, Woman, RemoveShoppingCartOutlined } from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import { Confirmation } from "../common/Confirmation";
import { ProductForm } from "../forms/ProductForm";
import InputResult from "../../model/InputResult";
import { useDispatchCode, useSelectorCart, useSelectorEmployees } from "../../hooks/hooks";
import CartItemCard from "../cards/CartItemCard";
import UserData from "../../model/UserData";
import CartItem from "../../model/CartItem";
const columnsCommon: GridColDef[] = [
    // {
    //     field: 'serial', headerName: '#', flex: 0.3, headerClassName: 'data-grid-header',
    //     align: 'center', headerAlign: 'center'
    // },
    {
        field: 'id', headerName: 'ID', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'name', headerName: 'Name', flex: 0.6, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'description', headerName: 'Description', flex: 0.7, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'category', headerName: 'Category', flex: 0.4, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'unit', headerName: 'Unit', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'price', headerName: 'Price', type: 'number', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'quantity', headerName: 'Quantity', type: 'number', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'sum', headerName: 'Sum', type: 'number', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'imageLink',
        headerName: 'Image',
        flex: 0.7,
        headerClassName: 'data-grid-header',
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => <img src={params.value} alt="product" width="50" height="50"  />,
    },
    
   ];
   
   
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Cart: React.FC = () => {
    const columnsAdmin: GridColDef[] = [
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<AddCircleOutline />}
                        onClick={() => updateQuantity(params.row, 1)
                        } />,
                    <GridActionsCellItem label="remove"  //<RemoveCircleOutline />
                        onClick={() =>{
                        const quantity = params.row.quantity as number;
                        if (quantity > 1 ) {
                          updateQuantity(params.row, -1);
                        } else {
                          removeCartItem(params.id);
                        }
                      
                        }}
                        icon={getIconRemoveItem()} 
                          />,
                        //getCardDecButton(),
                    <GridActionsCellItem label="remove" icon={<DeleteOutline />}
                        onClick={() => removeCartItem(params.id)
                        } />,
                    // <GridActionsCellItem label="update" icon={<Edit />}
                    //     onClick={() => {
                    //         employeeId.current = params.id as any;
                    //         if (params.row) {
                    //             const empl = params.row;
                    //             empl && (employee.current = empl);
                    //             setFlEdit(true)
                    //         }
    
                    //     }
                    //     } />
                ] ;
            }
        }
       ]
       const columnsPortrait: GridColDef[] = [
        columnsCommon[1],
        columnsCommon[6],
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                   
                    <GridActionsCellItem label="details" icon={<Visibility />}
                        onClick={() => {
                            productId.current = params.id as any;
                            if (params.row) {
                                const item = params.row;
                                item && (cartItem.current = item);
                                setFlDetails(true)
                            }
    
                        }
                        } />
                ] ;
            }
        }
       ]
    const dispatch = useDispatchCode();
    const userData = useSelectorAuth();
    const cartItems = useSelectorCart();
    const employees = useSelectorEmployees();
    const theme = useTheme();
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'));
    const columns = useMemo(() => getColumns(), [userData, cartItems, isPortrait]);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openEdit, setFlEdit] = useState(false);
    const [openDetails, setFlDetails] = useState(false);
    const [openOrderDetails, setOpenOrderDetails] = useState(false);
    const title = useRef('');
    const content = useRef('');
    const productId = useRef('');
    const confirmFn = useRef<any>(null);
    const cartItem = useRef<Product | undefined>();
    const [buttonFl, setButtonFl] = useState<boolean>(true);
    
    

    function getColumns(): GridColDef[] {
        
        return isPortrait ? columnsPortrait : getColumnsFromLandscape();
    }
    function getColumnsFromLandscape(): GridColDef[]{
        let res: GridColDef[] = columnsCommon;
         res = res.concat(columnsAdmin);
    return res;
    }
    function removeCartItem(id: any) {
        title.current = "Remove item from cart?";
        const cartItem = cartItems.find(prod => prod.id == id);
        content.current = `You are going to remove item with ${cartItem?.name} from cart`;
        productId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
    }
    async function actualRemove(isOk: boolean) {
        let errorMessage: string = '';
        if (isOk) {
            try {
                await ordersService.deleteCartProduct(productId.current);
            } catch (error: any) {
                errorMessage = error;
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);
    }
    function updateEmployee(empl: Product): Promise<InputResult> {
        setFlEdit(false)
        const res: InputResult = { status: 'error', message: '' };
        if (JSON.stringify(cartItem.current) != JSON.stringify(empl)) {
            title.current = "Update Cart object?";
            cartItem.current = empl;
            content.current = `You are going update product with id ${empl.id}`;
            confirmFn.current = actualUpdate;
            setOpenConfirm(true);
        }
        return Promise.resolve(res);
    }
    async function actualUpdate(isOk: boolean) {
        
       
        let errorMessage: string = '';

        if (isOk) {
            try {
                await ordersService.updateCartProduct(cartItem.current!);
            } catch (error: any) {
                errorMessage = error
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);

    }
    function cardAction(isDelete: boolean){
        if (isDelete) {
            updateQuantity(cartItem.current, 1);
        } else {
            const quantity = cartItem.current?.quantity as number;
            if (quantity && quantity > 1 ) {
                updateQuantity(cartItem.current, -1);
              } else {
                removeCartItem(cartItem.current!);
              }
        }
        setFlDetails(true)
    }
    async function updateQuantity (empl:any, newQuant:number): Promise<void> {
        const quantity= empl.quantity || 0;
        const emplCopy = { ...empl};
        let errorMessage: string = '';
        if (newQuant === 1) {
         emplCopy.quantity = quantity + 1;
         } else {
         emplCopy.quantity = quantity - 1;
        }
        emplCopy.sum = emplCopy.price * emplCopy.quantity;
        try {
            await ordersService.updateCartProduct(emplCopy!);
        } catch (error: any) {
            errorMessage = error;
        }
    dispatch(errorMessage, '');
    }
    
    // function getDataGridContent (employees:Employee[], cartProducts:Employee[]):CartItem[] {
        const cartContent: CartItem[] = cartItems.map(e => {
            const employee = employees.find(el => el.id == e.id);
            return {...e, 
                category: employee?.category,
                name: employee?.name,
                description: employee?.description,
                unit:employee?.unit,
                imageLink:employee?.imageLink,
                price: employee?.price,                
                sum: ((employees.find(el => el.id == e.id)?.price)||0) * (e.quantity||0)}
        });
        let totalSum = cartItems.length === 0 ? 0: cartContent.map(e => e.sum || 0).reduce((acc,cur) => acc + cur);
        // return res;
    // }

    
    
    function createOrderFn():void {
        setOpenOrderDetails(true);

    }
    let adress:string;
    let phone:string;
    let handlerAdress = (event:any) => {
        adress = event.target.value
    }
    let handlerPhone = (event:any) => {
        phone = String(event.target.value);
    }
    function orderDetailsClick (event:any) : void  {
       event.preventDefault();
       ordersService.addOrder(cartContent, adress, phone, totalSum, userData?.email);
       setOpenOrderDetails(false);
       ordersService.clearCart(cartContent); 
    }
    function getIconRemoveItem() {
        return buttonFl ? <RemoveCircleOutline /> : <></> ; 
    }

    return <Box sx={{
        display: 'flex', flexDirection: "column", justifyContent: 'center',
        alignContent: 'center'
    }}>
        <Box sx={{ height: '79vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={cartContent/*etDataGridContent(employees, cartProducts)*/} />
        </Box>
        <Box sx={{
            height: '10vh', width: '95vw', marginTop: '1vh',
            display: 'flex', flexDirection: "col", justifyContent: 'right',
            alignContent: 'center', gap: '2vw'
        }}>
            <Box sx={{ justifyContent: 'center', alignContent: 'center' }}>
                <div style={{ marginTop: "0.5vh", fontSize: "larger", fontWeight: "bold" }}>
                    Total Sum: {totalSum}
                </div>
            </Box>
            <Button style={{ textAlign: 'center', fontWeight: "bold", fontSize: "larger", justifyContent: 'center', height: '5vh' }}
                onClick={() => setOpenOrderDetails(true)}>Order Now</Button>;
        </Box>
        <Confirmation confirmFn={confirmFn.current} open={openConfirm}
            title={title.current} content={content.current}></Confirmation>
        <Modal
         open = {openOrderDetails}
         onClose={() => setOpenOrderDetails(false)}
         aria-labelledby="modal-modal-title"
         aria-describedby="modal-modal-description">
             <Box sx={{ height: '50vh', width: '70vw', backgroundColor:'white' }}>
                <form onSubmit={orderDetailsClick} >
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={8} sm={5} >
                        <TextField type="text" required fullWidth label="Delivery Adress"
                            helperText="enter adress" onChange={handlerAdress}
                            />
                        </Grid>
                        <Grid item xs={8} sm={4} md={5} >
                    <TextField label="phone" fullWidth required
                        type="number" onChange={handlerPhone}
                        helperText={`enter contact phone (from 0) `}
                        inputProps={{
                            minlength: '10',
                            maxlength: '11'
                        }} />
                </Grid>
                    </Grid>
                    <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                        <Button type="submit" >Confirm Order</Button>
                    </Box>
                </form>
             </Box>    
        </Modal>
        {/* <Modal
            open={openEdit}
            onClose={() => setFlEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <EmployeeForm submitFn={updateEmployee} employeeUpdated={employee.current} />
            </Box>

        </Modal> */}
        <Modal
            open={openDetails}
            onClose={() => setFlDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <CartItemCard actionFn={cardAction} cartItem={cartItem.current!} />
            </Box>
        </Modal>
    </Box>
}
export default Cart;