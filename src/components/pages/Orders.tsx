import { Box,  Button,  FormControl,  Grid,  InputLabel,  MenuItem,  Modal, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import Product from "../../model/Product";
import { productService, ordersService } from "../../config/service-config";
import { Subscription } from 'rxjs';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import productConfig from "../../config/product-config.json"
import { DeleteOutline, InventoryOutlined, HighlightOffOutlined, Visibility, Edit} from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import { Confirmation } from "../common/Confirmation";
import { ProductForm } from "../forms/ProductForm";
import InputResult from "../../model/InputResult";
import { useDispatchCode, useSelectorCart, useSelectorEmployees, useSelectorOrders } from "../../hooks/hooks";
import CartItemCard from "../cards/CartItemCard";
import UserData from "../../model/UserData";
import CartItem from "../../model/CartItem";
import Order from "../../model/Order";
import OrderCard from "../cards/OrderCard";
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
        field: 'dateTime', headerName: 'Creation Time', flex: 0.7, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
     {
        field: 'email', headerName: 'Email', flex: 0.5, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'adress', headerName: 'Adress', flex: 0.7, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'phone', headerName: 'Pnone', flex: 0.5, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'totalSum', headerName: 'TotalSum', type: 'number', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'status', headerName: 'Status', flex: 0.5, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
     
   ];

   const columnsDetails: GridColDef[] = [
    {
        field: 'id', headerName: 'ID', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'category', headerName: 'Category', flex: 0.4, headerClassName: 'data-grid-header',
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
        renderCell: (params) => <img src={params.value} alt="product" width="50" height="50" />,
    },

   ]
   
   
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

const {status:status} = productConfig;

const Orders: React.FC = () => {
    const columnsUser: GridColDef[] = [
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    // <GridActionsCellItem label="remove" icon={<AddCircleOutline />}
                    //     onClick={() => updateQuantity(params.row, 1)
                    //     } />,
                    <GridActionsCellItem label="details" icon={<InventoryOutlined />}
                        
                        onClick={() => {
                            const cartdetails = params.row.cartItems as object[];
                            setSelectedProduct(cartdetails);
                        }}/>,
                    <GridActionsCellItem label="remove" icon={<HighlightOffOutlined/>}
                        onClick={() => {
                        const orderDetails = params.row as object;
                        setCanceledStatus(orderDetails);

                    } }/>
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
                ]
            }
        }
       ]
       const columnsAdmin: GridColDef[] = [
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    // <GridActionsCellItem label="remove" icon={<AddCircleOutline />}
                    //     onClick={() => updateQuantity(params.row, 1)
                    //     } />,
                    <GridActionsCellItem label="details" icon={<InventoryOutlined />}
                        
                        onClick={() => {
                            const cartdetails = params.row.cartItems as object[];
                            setSelectedProduct(cartdetails);
                        }}/>,
                    <GridActionsCellItem label="remove" icon={<Edit />}
                        onClick={() => {
                        const orderDetails = params.row as object;
                        setSelectedOrder(orderDetails);
                        setEditOrder(true);
                        
                    } }/>
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
                ]
            }
        }
       ]
       const columnsPortrait: GridColDef[] = [
        columnsCommon[0],
        columnsCommon[3],
        columnsCommon[6],
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                   
                    <GridActionsCellItem label="details" icon={<Visibility />}
                    onClick={() => {
                        orderId.current = params.id as any;
                        if (params.row) {
                            const item = params.row;
                            item && (order.current = item);
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
    const cartProducts = useSelectorCart();
    const employees = useSelectorEmployees();
    const ordersData = useSelectorOrders();
    let orders = useSelectorOrders();
    if (userData?.role === 'user') {
        orders = orders.filter(e => e.email === userData?.email);
    }
    const theme = useTheme();
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'));
    const columns = useMemo(() => getColumns(), [userData, cartProducts, isPortrait]);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openEdit, setFlEdit] = useState(false);
    const [openDetails, setFlDetails] = useState(false);
    const title = useRef('');
    const content = useRef('');
    const employeeId = useRef('');
    const confirmFn = useRef<any>(null);
    const employee = useRef<Product | undefined>();
    const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>({});
    const [editOrder, setEditOrder] = useState(false);
    const orderId = useRef('');
    const order = useRef<Order | undefined>();
    
    function getColumns(): GridColDef[] {
        
        return isPortrait ? columnsPortrait : getColumnsFromLandscape();
    }
    function getColumnsFromLandscape(): GridColDef[]{
        let res: GridColDef[] = columnsCommon;
        res = res.concat(userData?.role === 'admin'? columnsAdmin : columnsUser);
    return res;
    }
    function removeEmployee(id: any) {
        title.current = "Remove Employee object?";
        const employee = cartProducts.find(empl => empl.id == id);
        content.current = `You are going remove employee with id ${employee?.id}`;
        employeeId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
    }
    async function actualRemove(isOk: boolean) {
        let errorMessage: string = '';
        if (isOk) {
            try {
                await ordersService.deleteCartProduct(employeeId.current);
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
        if (JSON.stringify(employee.current) != JSON.stringify(empl)) {
            title.current = "Update Employee object?";
            employee.current = empl;
            content.current = `You are going update employee with id ${empl.id}`;
            confirmFn.current = actualUpdate;
            setOpenConfirm(true);
        }
        return Promise.resolve(res);
    }
    async function actualUpdate(isOk: boolean) {
        
       
        let errorMessage: string = '';

        if (isOk) {
            try {
                await ordersService.updateCartProduct(employee.current!);
            } catch (error: any) {
                errorMessage = error
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);

    }
    function cardAction(isDelete: boolean){
        if (isDelete) {
            const cartdetails =  order.current?.cartItems as Product[];
                            setSelectedProduct(cartdetails);
        } else {
            const orderDetails = order.current;
                        setCanceledStatus(orderDetails);
        }
        //setFlDetails(false)
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
    const cartContent: CartItem[] = cartProducts.map(e => {
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
        let totalSum = cartProducts.length === 0 ? 0: cartContent.map(e => e.sum || 0).reduce((acc,cur) => acc + cur);
        // return res;
    // }

    function createOrderFn():void {
        ordersService.addOrder(cartContent, "Beer-Sheva", "0551112222", totalSum, userData?.email);
        ordersService.clearCart(cartContent);

    }

    async function setCanceledStatus(orderDetails: any): Promise<void> {
        const status = orderDetails.status;
        let errorMessage: string = '';
        if (status === "created") {
            const orderDetailsCopy = {...orderDetails};
            orderDetailsCopy.status = 'canceled';
            try {
                await ordersService.updateOrder(orderDetailsCopy!);
            } catch (error: any) {
                errorMessage = error;
            }
        }
        else {
            errorMessage = "Unable to cancel order";
        }
        dispatch(errorMessage, '');
       
       

    }
    let adress:string;
    let phone:string;
    let currentStatus:string;
    let handlerAdress = (event:any) => {
        adress = event.target.value
    }
    let handlerPhone = (event:any) => {
        phone = String(event.target.value);
    }
    let handlerStatus = (event:any) => {
        currentStatus = event.target.value;
    }

    async function orderEditClick(event: any): Promise<void> {
        event.preventDefault();
        let errorMessage: string = '';
        const selectedOrderCopy = { ...selectedOrder };
        adress && (selectedOrderCopy.adress = adress);
        phone && (selectedOrderCopy.phone = phone);
        status && (selectedOrderCopy.status = currentStatus);
        try {
            await ordersService.updateOrder(selectedOrderCopy);
            setEditOrder(false);
        } catch (error: any) {
            errorMessage = error;
        }
        dispatch(errorMessage, '');
    }

    return <Box sx={{
        display: 'flex', flexDirection: "column", justifyContent: 'center',
        alignContent: 'center'
    }}>
        <Box sx={{ height: '79vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={orders} style={{fontSize:"70%"}} />
        </Box>
        <Box sx={{
            height: '10vh', width: '95vw', marginTop: '1vh',
            display: 'flex', flexDirection: "col", justifyContent: 'right',
            alignContent: 'center', gap: '2vw'
        }}>
            {/* <Box sx={{ justifyContent: 'center', alignContent: 'center' }}>
                <div style={{ marginTop: "0.5vh", fontSize: "larger", fontWeight: "bold" }}>
                    Total Sum: {totalSum}
                </div>
            </Box>
            <Button style={{ textAlign: 'center', fontWeight: "bold", fontSize: "larger", justifyContent: 'center', height: '5vh' }}
                onClick={() => createOrderFn()}>Order Now</Button>; */}
        </Box>
        <Confirmation confirmFn={confirmFn.current} open={openConfirm}
            title={title.current} content={content.current}></Confirmation>
        <Modal open={selectedProduct.length > 0  }
            onClose={() => setSelectedProduct([])}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ height: '50vh', width: '90vw', backgroundColor: 'white' }}>
                <DataGrid columns={columnsDetails} rows={selectedProduct} style={{fontSize:"70%"}}/>
            </Box>
        </Modal>
        
        <Modal
            open={openEdit}
            onClose={() => setFlEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <ProductForm submitFn={updateEmployee} productUpdated={employee.current} />
            </Box>

        </Modal>
         <Modal
            open={openDetails}
            onClose={() => setFlDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <OrderCard actionFn={cardAction} order={order.current!} />
            </Box>
        </Modal>
        <Modal
            open={editOrder}
            onClose={() => setEditOrder(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={{ backgroundColor: 'white', position: 'absolute' as 'absolute',top: '25%', left: '25%', }}>
            <Typography variant="h5" color="text.secondary" textAlign="center" margin="2vw">
                                    Edit Order
                                </Typography>
                <form onSubmit={orderEditClick} >
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={8} sm={5} >
                            <TextField type="text" defaultValue={selectedOrder.adress} fullWidth label="Delivery Adress"
                                helperText="enter adress" onChange={handlerAdress}
                            />
                        </Grid>
                        <Grid item xs={8} sm={4} md={5} >
                            <TextField label="phone" fullWidth
                                type="number" defaultValue={selectedOrder.phone} onChange={handlerPhone}
                                helperText={`enter contact phone (from 0) `}
                                inputProps={{
                                    minlength: '10',
                                    maxlength: '11'
                                }} />
                        </Grid>
                        <Grid item xs={8} sm={5} >
                            <FormControl fullWidth required>
                                <InputLabel id="select-unit-id">Unit</InputLabel>
                                <Select labelId="select-unit-id" label="Status"
                                    defaultValue={selectedOrder.status} onChange={handlerStatus}>
                                     {status.map(status => <MenuItem value={status} key={status}>{status}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                        <Button type="submit" >Confirm Edit</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    </Box>
}
export default Orders;